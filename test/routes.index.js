var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
           res.render('index', { title: 'Express' });
           });

//router.get('/getpass.do', function(req, res){
var getpass_fun = function(req, res){
    
    var passIdentifier = "pass.xyz.vigilant.test"; //服务器生产pass唯一标识
    var providerName = "BLK"; //服务提供商
    
    var createTemplate = require("passbook");
    var template = createTemplate('eventTicket', {
                                  passTypeIdentifier: passIdentifier,        //后台配置，由客户端开发人员提供
                                  teamIdentifier:     "NZZ3WR97WN",                           //后台配置，由客户端开发人员提供
                                  organizationName: "BLK",
                                  description: "node passbook test",
                                  backgroundColor: "rgb(206, 140, 53)",                       //服务器配置
                                  foregroundColor: "rgb(255, 255, 255)",                      //服务器配置
                                  formatVersion: 1
                                  });
    
    template.keys("./public/key/pass", "12345");                   //pass生成证书和密钥，由客户端开发人员提供
    template.loadImagesFrom("./public/images/pass");                //生成pass的图片素材，由服务器配置
    
    var pass = template.createPass({
                                   serialNumber:  "123456",
                                   locations:[{  "longitude" : -122.3748889,"latitude" : 37.6189722},
                                              {   "altitude" : 10.0, "longitude" : -122.029, "latitude" : 37.331, relevantText : "距离机场10公里"}],
                                   
                                   relevantDate: "2013-04-20T20:30-08:00",
                                   
                                   barcode : {
                                   "message" : "hello passbook",
                                   "format" : "PKBarcodeFormatQR",
                                   "messageEncoding" : "utf-8"
                                   }
                                   });
    
    pass.headerFields.add('type', '奖卷', '1');
    pass.primaryFields.add('provider', '', providerName);
    pass.secondaryFields.add('expires', '有效期', '2013年4月23日~2013年5月4日');
    
    var File = require('fs'); 
    var file = File.createWriteStream('./public/tmp/pass.pkpass');
    pass.on('error',function(error){
            if(error){
            console.log(error);
            }
            res.render('index', { title: 'MyService | pass create error!' });
            });
    pass.pipe(file);
    pass.on("end", function(){        
            res.header('Content-Type','application/vnd.apple.pkpass');
            res.download('./public/tmp/pass.pkpass');
            });
};

router.get('/getpass.do', getpass_fun);

module.exports = router;
