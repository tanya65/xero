const express=require('express');
const XeroClient=require('xero-node').AccountingAPIClient;
const config=require('./config.json');

let app=express();
let xero=new XeroClient(config);



let lastRequestToken=null;

app.get('/',function(req,res){
    res.send("<a href='/connect'>connect to xero</a> ");
})
app.get('/connect',async function(req,res){
    lastRequestToken= await xero.oauth1Client.getRequestToken();
    let authUrl=xero.oauth1Client.buildAuthoriseUrl(lastRequestToken);
    res.redirect(authUrl);
})
app.get('/callback',async function(req,res){

    let verifier = req.query.oauth_verifier;
    xero.setAccessToken(lastRequestToken, oauthSecret, verifier)
        .then(() => {
            //We're connected to Xero so get something useful!
            xero.core.organisations.getOrganisation()
                .then((organisation) => {
                    res.render('index', {
                        org: organisation
                    })
                })
        })
        .catch((err) => {
            console.log(err);
            res.render('index', { err: err.data })
        })

   /* let oauth_verifier=req.query.oauth_verifier;
    let accessToken=await xero.oauth1Client.swapRequestTokenforAccessToken(lastRequestToken,oauth_verifier);
    let org=await xero.organisations.get();
    let invoices=await xero.invoices.get();
   
   let lastinvoice=invoices.Invoices[2].InvoiceNumber;
   // res.send(invoices);
   res.send("invoice number is: "+lastinvoice+" or got to: <a href='https://api.xero.com/api.xro/2.0/TaxRates'>here!</a>");*/
})
app.listen(3004,()=>{
    console.log("listening..");
})
