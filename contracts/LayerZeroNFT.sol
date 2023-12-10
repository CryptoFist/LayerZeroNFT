// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.20;

import "@layerzerolabs/solidity-examples/contracts/token/onft/ONFT721.sol";

contract LayerZeroNFT is ONFT721 {
    uint256 brigedCount;

    uint256 tokenId;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _minGasToTransfer,
        address _lzEndPoint
    ) ONFT721(_name, _symbol, _minGasToTransfer, _lzEndPoint) {
        tokenId = 1;
    }

    function mintNFT() external {
        _mint(msg.sender, tokenId++);
    }

    function sendFrom(
        address _from,
        uint16 _dstChainId,
        bytes memory _toAddress,
        uint _tokenId,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes memory _adapterParams
    ) public payable virtual override(ONFT721Core, IONFT721Core) {
        _send(
            _from,
            _dstChainId,
            _toAddress,
            _toSingletonArray(_tokenId),
            _refundAddress,
            _zroPaymentAddress,
            _adapterParams
        );
    }

    function _debitFrom(
        address _from,
        uint16,
        bytes memory,
        uint _tokenId
    ) internal virtual override {
        require(
            _isApprovedOrOwner(_msgSender(), _tokenId),
            "ONFT721: send caller is not owner nor approved"
        );
        require(
            ERC721.ownerOf(_tokenId) == _from,
            "ONFT721: send from incorrect owner"
        );
        brigedCount++;
        _transfer(_from, address(this), _tokenId);
    }

    function _creditTo(
        uint16,
        address _toAddress,
        uint _tokenId
    ) internal virtual override {
        require(
            !_exists(_tokenId) ||
                (_exists(_tokenId) && ERC721.ownerOf(_tokenId) == address(this))
        );
        brigedCount++;
        if (!_exists(_tokenId)) {
            _safeMint(_toAddress, _tokenId);
        } else {
            _transfer(address(this), _toAddress, _tokenId);
        }
    }
}
