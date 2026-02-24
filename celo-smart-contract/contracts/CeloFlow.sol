// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CeloFlow {
    struct Stream {
        address employer;
        address employee;
        uint256 totalAmount;
        uint256 startTime;
        uint256 duration;
        uint256 withdrawnAmount;
        bool isActive;
    }

    uint256 public nextStreamId;
    mapping(uint256 => Stream) public streams;

    event StreamCreated(
        uint256 indexed streamId,
        address indexed employer,
        address indexed employee,
        uint256 totalAmount,
        uint256 duration
    );

    event Withdrawn(uint256 indexed streamId, address indexed employee, uint256 amount);
    event StreamCancelled(uint256 indexed streamId, uint256 paidToEmployee, uint256 refundedToEmployer);

    function createStream(address _employee, uint256 _duration) external payable {
        require(_employee != address(0), "Invalid employee");
        require(msg.value > 0, "Must deposit funds");
        require(_duration > 0, "Duration must be > 0");

        streams[nextStreamId] = Stream({
            employer: msg.sender,
            employee: _employee,
            totalAmount: msg.value,
            startTime: block.timestamp,
            duration: _duration,
            withdrawnAmount: 0,
            isActive: true
        });

        emit StreamCreated(nextStreamId, msg.sender, _employee, msg.value, _duration);
        nextStreamId++;
    }

    function getAvailable(uint256 _streamId) public view returns (uint256) {
        Stream memory stream = streams[_streamId];

        if (!stream.isActive) return 0;

        uint256 elapsed;
        if (block.timestamp >= stream.startTime + stream.duration) {
            elapsed = stream.duration;
        } else {
            elapsed = block.timestamp - stream.startTime;
        }

        uint256 earned = (stream.totalAmount * elapsed) / stream.duration;
        return earned - stream.withdrawnAmount;
    }

    function withdraw(uint256 _streamId) external {
        Stream storage stream = streams[_streamId];

        require(msg.sender == stream.employee, "Not employee");
        require(stream.isActive, "Stream inactive");

        uint256 amount = getAvailable(_streamId);
        require(amount > 0, "Nothing to withdraw");

        stream.withdrawnAmount += amount;

        (bool success, ) = payable(stream.employee).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(_streamId, msg.sender, amount);
    }

    function cancelStream(uint256 _streamId) external {
        Stream storage stream = streams[_streamId];

        require(msg.sender == stream.employer, "Not employer");
        require(stream.isActive, "Already inactive");

        uint256 availableToEmployee = getAvailable(_streamId);
        uint256 refundableToEmployer = stream.totalAmount - stream.withdrawnAmount - availableToEmployee;

        stream.isActive = false;
        if (availableToEmployee > 0) {
            stream.withdrawnAmount += availableToEmployee;
            (bool paidEmployee, ) = payable(stream.employee).call{value: availableToEmployee}("");
            require(paidEmployee, "Employee transfer failed");
        }

        if (refundableToEmployer > 0) {
            (bool refundedEmployer, ) = payable(stream.employer).call{value: refundableToEmployer}("");
            require(refundedEmployer, "Employer refund failed");
        }

        emit StreamCancelled(_streamId, availableToEmployee, refundableToEmployer);
    }
}
