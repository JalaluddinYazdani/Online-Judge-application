module.exports=async()=>{
    const maxm=999999;
    const minm=100000;
    const otp=await String(Math.floor(Math.random()*(maxm-minm+1))+minm);
    return otp;
}