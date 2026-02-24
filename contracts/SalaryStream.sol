// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SalaryStream is ReentrancyGuard {
    IERC20 public token; // cUSD token address

    struct Stream {
        address employer;
        address employee;
        uint256 totalAmount;
        uint256 startTime;
        uint256 duration;
        uint256 withdrawnAmount;
        bool active;
    }

    mapping(uint256 => Stream) public streams;
    uint256 public streamCount;

    event StreamCreated(
        uint256 indexed streamId,
        address indexed employer,
        address indexed employee,
        uint256 totalAmount,
        uint256 duration
    );

    event Withdrawal(
        uint256 indexed streamId,
        address indexed employee,
        uint256 amount
    );

    event StreamCancelled(uint256 indexed streamId);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    /**
     * @notice Create a new salary stream
     * @param _employee Address of the employee
     * @param _duration Duration of the stream in seconds
     */
    function createStream(address _employee, uint256 _duration) external nonReentrant returns (uint256) {
        require(_employee != address(0), "Invalid employee address");
        require(_duration > 0, "Duration must be greater than 0");
        require(msg.value > 0 || token.allowance(msg.sender, address(this)) > 0, "No amount specified");

        uint256 amount = msg.value > 0 ? msg.value : token.allowance(msg.sender, address(this));
        
        // Transfer tokens from employer to contract
        if (msg.value == 0) {
            require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        }

        uint256 streamId = streamCount++;
        streams[streamId] = Stream({
            employer: msg.sender,
            employee: _employee,
            totalAmount: amount,
            startTime: block.timestamp,
            duration: _duration,
            withdrawnAmount: 0,
            active: true
        });

        emit StreamCreated(streamId, msg.sender, _employee, amount, _duration);
        return streamId;
    }

    /**
     * @notice Get available amount for withdrawal
     * @param _streamId ID of the stream
     */
    function getAvailable(uint256 _streamId) public view returns (uint256) {
        Stream storage stream = streams[_streamId];
        require(stream.active, "Stream is not active");

        uint256 elapsed = block.timestamp > stream.startTime ? block.timestamp - stream.startTime : 0;
        
        if (elapsed >= stream.duration) {
            return stream.totalAmount - stream.withdrawnAmount;
        }

        uint256 earned = (stream.totalAmount * elapsed) / stream.duration;
        return earned > stream.withdrawnAmount ? earned - stream.withdrawnAmount : 0;
    }

    /**
     * @notice Withdraw available funds
     * @param _streamId ID of the stream
     */
    function withdraw(uint256 _streamId) external nonReentrant {
        Stream storage stream = streams[_streamId];
        require(stream.employee == msg.sender, "Only employee can withdraw");
        require(stream.active, "Stream is not active");

        uint256 available = getAvailable(_streamId);
        require(available > 0, "No funds available");

        stream.withdrawnAmount += available;
        require(token.transfer(msg.sender, available), "Transfer failed");

        emit Withdrawal(_streamId, msg.sender, available);
    }

    /**
     * @notice Cancel a stream (employer only)
     * @param _streamId ID of the stream
     */
    function cancelStream(uint256 _streamId) external nonReentrant {
        Stream storage stream = streams[_streamId];
        require(stream.employer == msg.sender, "Only employer can cancel");
        require(stream.active, "Stream is already inactive");

        uint256 available = getAvailable(_streamId);
        
        // Transfer available to employee
        if (available > 0) {
            stream.withdrawnAmount += available;
            require(token.transfer(stream.employee, available), "Transfer to employee failed");
        }

        // Return remaining to employer
        uint256 remaining = stream.totalAmount - stream.withdrawnAmount;
        if (remaining > 0) {
            require(token.transfer(stream.employer, remaining), "Transfer to employer failed");
        }

        stream.active = false;
        emit StreamCancelled(_streamId);
    }

    /**
     * @notice Get total earned amount for a stream
     * @param _streamId ID of the stream
     */
    function getTotalEarned(uint256 _streamId) public view returns (uint256) {
        Stream storage stream = streams[_streamId];
        
        uint256 elapsed = block.timestamp > stream.startTime ? block.timestamp - stream.startTime : 0;
        
        if (elapsed >= stream.duration) {
            return stream.totalAmount;
        }

        return (stream.totalAmount * elapsed) / stream.duration;
    }

    /**
     * @notice Get stream details
     * @param _streamId ID of the stream
     */
    function getStream(uint256 _streamId) public view returns (Stream memory) {
        return streams[_streamId];
    }
}
