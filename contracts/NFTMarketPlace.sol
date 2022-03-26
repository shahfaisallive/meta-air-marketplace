// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./NFT.sol";

contract NFTMarketPlace is ReentrancyGuard {
    ERC20 private token;

    address payable owner;

    using Counters for Counters.Counter;
    Counters.Counter private itemId;
    Counters.Counter private itemsSold;

    constructor() {
        owner = payable(msg.sender);
        token = ERC20(address(0xB10FaC2e703a1E30c1726577B4CBF307c0C507f7));
    }

    struct bid {
        uint256 bidAmount;
        uint256 nftId;
        address bidPlacedBy;
    }


    struct NftMerketItem {
        address nftContract;
        uint256 id;
        uint256 tokenId;
        //=>
        address payable creator;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        address oldOwner;
        address oldSeller;
        uint256 oldPrice;
        bool isResell;
        bool soldFirstTime;
        bool isAuctionOpen;
        uint256 auctionEnds;
    }

    event NftMarketItemCreated(
        address indexed nftContract,
        uint256 indexed id,
        uint256 tokenId,
        //=>
        address creator,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        address oldOwner,
        address oldSeller,
        uint256 oldPrice,
        bool isResell,
        bool soldFirstTime
    );
    //=>
    event ProductUpdated(
        uint256 indexed id,
        uint256 indexed newPrice,
        bool sold,
        address owner,
        address seller,
        bool soldFirstTime
    );
    //=>

    //=>
    event ProductSold(
        uint256 indexed id,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        uint256 price,
        address oldOwner,
        address oldSeller,
        uint256 oldPrice,
        bool isResell,
        bool soldFirstTime
    );
    //==>
    event ProductListed(uint256 indexed itemId);
    ///=>
    modifier onlyProductOrMarketPlaceOwner(uint256 id) {
        if (idForMarketItem[id].owner != address(0)) {
            require(idForMarketItem[id].owner == msg.sender);
        } else {
            require(
                idForMarketItem[id].seller == msg.sender || msg.sender == owner
            );
        }
        _;
    }

    modifier onlyProductSeller(uint256 id) {
        require(
            idForMarketItem[id].owner == address(0) &&
                idForMarketItem[id].seller == msg.sender,
            "Only the product can do this operation"
        );
        _;
    }

    modifier onlyItemOwner(uint256 id) {
        require(
            idForMarketItem[id].owner == msg.sender,
            "Only product owner can do this operation"
        );
        _;
    }

    modifier onlyItemOldOwner(uint256 id) {
        require(
            idForMarketItem[id].oldOwner == msg.sender,
            "Only product Old owner can do this operation"
        );
        _;
    }


    function transferMyTokens(address _from, address _to, uint256 amount) public {
        token.transferFrom(_from, _to, amount);
    }

    ///////////////////////////////////
    mapping(uint256 => NftMerketItem) private idForMarketItem;
    mapping(uint256 => bid) public bids;

    ///////////////////////////////////
    function createItemForSale(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price should be moreThan 1");
        require(tokenId > 0, "token Id should be moreThan 1");

        require(nftContract != address(0), "address should not be equal 0x0");
        itemId.increment();
        uint256 id = itemId.current();

        idForMarketItem[id] = NftMerketItem(
            nftContract,
            id,
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            price,
            false,
            payable(address(0)),
            payable(address(0)),
            price,
            false,
            false,
            false,
            block.timestamp
        );


        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit NftMarketItemCreated(
            nftContract,
            id,
            tokenId,
            msg.sender,
            msg.sender,
            address(0),
            price,
            false,
            address(0),
            address(0),
            price,
            false,
            false
        );
    }

    // Place Bid
    function placeBid(uint256 nftItemId, uint256 amount) public {
        uint256 bidderBalance = token.balanceOf(msg.sender);
        require(bidderBalance >= amount, "You dont have enough balance to place bid of this amount.");
        require(idForMarketItem[nftItemId].seller != address(0), "NFT belong to contract yet");
        require(idForMarketItem[nftItemId].sold == false, "NFT already sold");
        require(msg.sender != idForMarketItem[nftItemId].seller, "You are seller, you can't place bids on this nft");
        require(amount > idForMarketItem[nftItemId].price, "Bid amount should be greater than price of NFT");
        require(amount > bids[nftItemId].bidAmount, "Place a higher bid than previous bidder");
        bids[nftItemId] = bid(
            amount,
            nftItemId,
            payable(msg.sender)
        );
    }


    // get Higest bid for NFT
    function getHighestBid(uint256 nftItemId) public view returns (bid memory){
        return bids[nftItemId];
    }

    // Set auction end time
    function setAuctionEndTime(uint256 time, uint256 nftItemId) public {
        require(msg.sender == idForMarketItem[nftItemId].seller, "You are not owner of this NFT");
        idForMarketItem[nftItemId].auctionEnds = time;
    }

    // Set auction enabled/disabled
    function setAuctionActive(bool status, uint256 nftItemId) public {
        require(msg.sender == idForMarketItem[nftItemId].seller, "You are not owner of this NFT");
        idForMarketItem[nftItemId].isAuctionOpen = status;
    }

        // Sell to bidder
    function sellToBidder(address nftContract, address buyer, uint256 nftItemId) public payable nonReentrant{
        require(msg.sender == idForMarketItem[nftItemId].seller, "You are not owner of this NFT");
        require(buyer == bids[nftItemId].bidPlacedBy, "buyer not matched");
    address serviceFeesAddress = 0xb221C202cF15E088B5DF9C60e7C919A193830806;
        uint256 tokenId = idForMarketItem[nftItemId].tokenId;

    // Transfering MAIR tokens to everybody
        uint256 amount = bids[nftItemId].bidAmount;

        uint256 creatorRoyalty = (amount/100)*10;
        uint256 serviceFees = (amount/100)*8;
        uint256 sellerAmount = amount - (creatorRoyalty + serviceFees);
        transferMyTokens(buyer, idForMarketItem[nftItemId].creator, creatorRoyalty);
        transferMyTokens(buyer, idForMarketItem[nftItemId].seller, sellerAmount);
        transferMyTokens(buyer, serviceFeesAddress , serviceFees);

        
        IERC721(nftContract).transferFrom(address(this), buyer, tokenId); //buy
        idForMarketItem[nftItemId].owner = payable(buyer);
        idForMarketItem[nftItemId].sold = true;
        idForMarketItem[nftItemId].isResell = true;
        idForMarketItem[nftItemId].soldFirstTime = true;
        idForMarketItem[nftItemId].oldPrice = idForMarketItem[nftItemId].price;
        idForMarketItem[nftItemId].price = amount;


        itemsSold.increment();

    }

    //Buy nft
    function buyNFt(address nftContract, uint256 nftItemId, uint256 amount)
        public
        payable
        nonReentrant
    {
        uint256 price = idForMarketItem[nftItemId].price;
        require(amount >= price, "you are not sending enough amount to buy" );
        address serviceFeesAddress = 0xb221C202cF15E088B5DF9C60e7C919A193830806;
        uint256 tokenId = idForMarketItem[nftItemId].tokenId;

    // Transfering MAIR tokens to everybody
        uint256 creatorRoyalty = (amount/100)*10;
        uint256 serviceFees = (amount/100)*8;
        uint256 sellerAmount = amount - (creatorRoyalty + serviceFees);
        transferMyTokens(msg.sender, idForMarketItem[nftItemId].creator, creatorRoyalty);
        transferMyTokens(msg.sender, idForMarketItem[nftItemId].seller, sellerAmount);
        transferMyTokens(msg.sender, serviceFeesAddress , serviceFees);


        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId); //buy
        idForMarketItem[nftItemId].owner = payable(msg.sender);
        idForMarketItem[nftItemId].sold = true;
        idForMarketItem[nftItemId].isResell = true;
        idForMarketItem[nftItemId].soldFirstTime = true;

        itemsSold.increment();
    }

    //REsell

    function putItemToResell(
        address nftContract,
        uint256 itemId,
        uint256 newPrice
    ) public payable nonReentrant onlyItemOwner(itemId) {
        uint256 tokenId = idForMarketItem[itemId].tokenId;
        require(newPrice > 0, "Price must be at least 1 wei");

        NFT tokenContract = NFT(nftContract);

        tokenContract.transferToken(msg.sender, address(this), tokenId);

        address payable oldOwner = idForMarketItem[itemId].owner;
        address payable oldSeller = idForMarketItem[itemId].seller;

        uint256 oldPrice = idForMarketItem[itemId].price;

        idForMarketItem[itemId].owner = payable(address(0));
        idForMarketItem[itemId].seller = oldOwner;
        idForMarketItem[itemId].price = newPrice;
        idForMarketItem[itemId].sold = false;
        idForMarketItem[itemId].isResell = false;

        //Start to save old value
        idForMarketItem[itemId].oldOwner = oldOwner;
        idForMarketItem[itemId].oldSeller = oldSeller;
        idForMarketItem[itemId].oldPrice = oldPrice;

        itemsSold.decrement();
        emit ProductListed(itemId);
    }

    //TO DO Send when cancel fees to Owner
    function cancelResellWitholdPrice(address nftContract, uint256 nftItemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idForMarketItem[nftItemId].oldPrice;
        uint256 tokenId = idForMarketItem[nftItemId].tokenId;

        //require(msg.value == price,"should buy the price of item");
        //idForMarketItem[nftItemId].seller.transfer(msg.value);
        //  address sellerAddress = idForMarketItem[nftItemId].seller;
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId); //buy
        idForMarketItem[nftItemId].owner = payable(msg.sender);
        idForMarketItem[nftItemId].price = price;
        idForMarketItem[nftItemId].seller = payable(
            idForMarketItem[nftItemId].oldSeller
        );
        idForMarketItem[nftItemId].sold = true;
        itemsSold.increment();

        emit ProductSold(
            idForMarketItem[nftItemId].id,
            idForMarketItem[nftItemId].nftContract,
            idForMarketItem[nftItemId].tokenId,
            idForMarketItem[nftItemId].creator,
            idForMarketItem[nftItemId].seller,
            payable(msg.sender),
            idForMarketItem[nftItemId].price,
            address(0),
            address(0),
            0,
            idForMarketItem[nftItemId].isResell,
            true
        );
    }

    ///FETCH SINGLE NFT
    function fetchSingleItem(uint256 id)
        public
        view
        returns (NftMerketItem memory)
    {
        return idForMarketItem[id];
    }

    //=>Update Item =>We Dont Use This

    function getMyItemCreated() public view returns (NftMerketItem[] memory) {
        uint256 totalItemCount = itemId.current();
        uint256 myItemCount = 0; //10
        uint256 myCurrentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idForMarketItem[i + 1].seller == msg.sender) {
                myItemCount += 1;
            }
        }
        NftMerketItem[] memory nftItems = new NftMerketItem[](myItemCount); //list[3]
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idForMarketItem[i + 1].seller == msg.sender) {
                //[1,2,3,4,5]
                uint256 currentId = i + 1;
                NftMerketItem storage currentItem = idForMarketItem[currentId];
                nftItems[myCurrentIndex] = currentItem;
                myCurrentIndex += 1;
            }
        }

        return nftItems;
    }

    //Create My purchased Nft Item

    function getMyNFTPurchased() public view returns (NftMerketItem[] memory) {
        uint256 totalItemCount = itemId.current();
        uint256 myItemCount = 0; //10
        uint256 myCurrentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idForMarketItem[i + 1].owner == msg.sender) {
                myItemCount += 1;
            }
        }

        NftMerketItem[] memory nftItems = new NftMerketItem[](myItemCount); //list[3]
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idForMarketItem[i + 1].owner == msg.sender) {
                //[1,2,3,4,5]
                uint256 currentId = i + 1;
                NftMerketItem storage currentItem = idForMarketItem[currentId];
                nftItems[myCurrentIndex] = currentItem;
                myCurrentIndex += 1;
            }
        }

        return nftItems;
    }

    //Fetch  all unsold nft items
    function getAllUnsoldItems() public view returns (NftMerketItem[] memory) {
        uint256 totalItemCount = itemId.current();
        uint256 myItemCount = itemId.current() - itemsSold.current();
        uint256 myCurrentIndex = 0;

        NftMerketItem[] memory nftItems = new NftMerketItem[](myItemCount); //list[3]
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idForMarketItem[i + 1].owner == address(0)) {
                //[1,2,3,4,5]
                uint256 currentId = i + 1;
                NftMerketItem storage currentItem = idForMarketItem[currentId];
                nftItems[myCurrentIndex] = currentItem;
                myCurrentIndex += 1;
            }
        }

        return nftItems;
    }

    //Get resell my items

    function getMyResellItems() public view returns (NftMerketItem[] memory) {
        uint256 totalItemCount = itemId.current();
        uint256 myItemCount = 0; //10
        uint256 myCurrentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                (idForMarketItem[i + 1].seller == msg.sender) &&
                (idForMarketItem[i + 1].sold == false)
            ) {
                myItemCount += 1;
            }
        }

        NftMerketItem[] memory nftItems = new NftMerketItem[](myItemCount); //list[3]
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                (idForMarketItem[i + 1].seller == msg.sender) &&
                (idForMarketItem[i + 1].sold == false)
            ) {
                //[1,2,3,4,5]
                uint256 currentId = i + 1;
                NftMerketItem storage currentItem = idForMarketItem[currentId];
                nftItems[myCurrentIndex] = currentItem;
                myCurrentIndex += 1;
            }
        }

        return nftItems;
    }
}
