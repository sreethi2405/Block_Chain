const sha256= require('crypto-js/sha256')

class Transaction{
    constructor(fromAddress,toAddress, amount)
    {
        this.fromAddress=fromAddress
        this.toAddress=toAddress
        this.amount=amount
    }
}

class Block{
    constructor(timestamp,transaction,previoushash=''){
        this.timestamp=timestamp;
        this.transaction=transaction;
        this.previoushash= previoushash;
        this.hash=this.calculatehash();
        this.nonce=0;
    }

    calculatehash()
    {
        return sha256(this.timestamp+this.previoushash+JSON.stringify(this.data)+this.nonce).toString();
    }

    mineblock(difficulty)
    {
        while(this.hash.substring(0,difficulty)!== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash=this.calculatehash()
        }
        console.log("Block mined : "+this.hash)
    }
}

class blockchain{
    constructor(){
        this.chain=[this.createGenesisBlock()]
        this.difficulty=1
        this.pendingTransactions= []
        this.miningReward=100

    }

    createGenesisBlock()
    {
        return new Block("28/3/2018","genesis block" ,"0")
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length-1]
    }
    
    minePendingTransactions(miningRewardAddress)
    { 
        //console.log("entered pending trans")
        let block= new Block(Date.now(),this.pendingTransactions)
        block.mineblock(this.difficulty)
        console.log("Block successfully mined")
        this.chain.push(block)
        this.pendingTransactions=[new Transaction(null,miningRewardAddress,this.miningReward)]

    }

    createTransaction(transaction){
       // console.log("entered transaction")
        this.pendingTransactions.push(transaction)
    }

    getBalance(address)
    {
        let balance=0
        for(const block of this.chain)
        {
            for(const trans of block.transaction){
                if(trans.fromAddress===address){
                    balance-=trans.amount
                }

                if(trans.toAddress===address){
                    balance+=trans.amount
                }
            }
        }
        return balance 
    }

    isBlockChainValid(){
        for(let i=1;i<this.chain.length;i++)
        {
            const currblock=this.chain[i]
            const prevblock=this.chain[i - 1]
            if(currblock.hash!==currblock.calculatehash()){
                return false
            }
            if(currblock.previoushash!==prevblock.hash)
            {
                return false
            }
        }
        return true
    }
}

let sreethi=new blockchain()
/*console.log("mining block 1..")
sreethi.addBlock(new block(1,"29/3/2018",{amount:100}))
console.log("mining block 2...")
sreethi.addBlock(new block(2,"30/3/2018",{amount:200}))

console.log("is my block chain valid?"+sreethi.isBlockChainValid())
console.log(JSON.stringify(sreethi,null,4))
sreethi.chain[1].data={amount:100}
console.log("is my block chain valid after tampering?"+sreethi.isBlockChainValid())
*/
//pending transactions
sreethi.createTransaction(new Transaction('address1','address2',100))
sreethi.createTransaction(new Transaction('address2','address1',50))
console.log(JSON.stringify(sreethi,null,4))
console.log("\n Miner is started")
sreethi.minePendingTransactions("sreethiwallet")
console.log("\nThe balance f sreethi is"+sreethi.getBalance("sreethiwallet"))
console.log("\n Miner is started again")
sreethi.minePendingTransactions("sreethiwallet")
console.log("\nThe balance f sreethi is"+sreethi.getBalance("sreethiwallet"))