var serial = {};

var SerialAlphaLast = 0;
var SerialBetaLast  = 0;
var SerialGammaLast = 0;

var dateSerialAlpha = {};
var dateSerialBeta = {};
var dateSerialGamma = {};
var pSerialAlpha = 0;
var pSerialBeta = 0;
var pSerialGamma = 0;

var pSerialAlphaMax = 0;
var pSerialBetaMax = 0;
var pSerialGammaMax = 0;
var pSerialAlphaMin = 0;
var pSerialBetaMin = 0;
var pSerialGammaMin = 0;

(function() {
  'use strict';

  serial.getPorts = function() {
    return navigator.usb.getDevices().then(devices => {
      return devices.map(device => new serial.Port(device));
    });
  };

  serial.requestPort = function() {
    const filters = [
      { 'vendorId': 0x2341, 'productId': 0x8036 },
      { 'vendorId': 0x2341, 'productId': 0x8037 },
      { 'vendorId': 0x2341, 'productId': 0x804d },
      { 'vendorId': 0x2341, 'productId': 0x804e },
      { 'vendorId': 0x2341, 'productId': 0x804f },
      { 'vendorId': 0x2341, 'productId': 0x8050 },
    ];
    return navigator.usb.requestDevice({ 'filters': filters }).then(
      device => new serial.Port(device)
    );
  }

  serial.Port = function(device) {
    this.device_ = device;
  };

  serial.Port.prototype.connect = function() {
    
    var SerialAlphaLocal;
    var SerialGammaLocal;
    var SerialBetaLocal;

    var tdata;
    var nagetiveM;
    var valueAngle;   
	  
    var tsum;
    var tcount;
    var tvector;
	  
    var pSerialBufferLength = 8;	  
  		
    let readLoop = () => {
		
    this.device_.transferIn(5, 64).then(result => {
    if( result.data.byteLength == 4 && result.data.getUint8(0) == 161 )
    {
      let view = new Uint8Array(3);
      view[0] = 56;
      view[1] = 12;
      view[2] = 88;
      return this.device_.transferOut(4, view);
    }

    if( result.data.byteLength == 34 )
    {	
    if( result.data.getUint8(0) == 168 )
    {
    	  if(result.data.getUint8(2) >= 100)
    	  {
    	  	  SerialAlphaLocal =  result.data.getUint8(1) + ((result.data.getUint8(2) - 100)/100);
				    SerialAlphaLocal =  -SerialAlphaLocal;
    	  }
    	  else
    	  {
    	  	  SerialAlphaLocal =  result.data.getUint8(1) + (result.data.getUint8(2)/100);
    	  }
    	  
    	  if(result.data.getUint8(4) >= 100)
    	  {
    	  	  SerialBetaLocal =  result.data.getUint8(3) + ((result.data.getUint8(4) - 100)/100);
				    SerialBetaLocal =  -SerialBetaLocal;
    	  }
    	  else
    	  {
    	  	  SerialBetaLocal =  result.data.getUint8(3) + (result.data.getUint8(4)/100);
    	  }
    	  
    	  if(result.data.getUint8(6) >= 100)
    	  {
    	  	  SerialGammaLocal =  result.data.getUint8(5) + ((result.data.getUint8(6) - 100)/100);
				    SerialGammaLocal =  -SerialGammaLocal;
    	  }
    	  else
    	  {
    	  	  SerialGammaLocal =  result.data.getUint8(5) + (result.data.getUint8(6)/100);
    	  }
		          	
		SerialAlpha = SerialAlphaLocal; 
		SerialBeta  = SerialBetaLocal;  
		SerialGamma = SerialGammaLocal;  
	    
	  console.log( "NOW" + (SerialAlpha) + " " + (SerialBeta) + " " + (SerialGamma));	
	    
    if(SerialGamma < -180) SerialGamma = -180; if(SerialGamma > 180) SerialGamma = 180;
    if(SerialBeta < -90) SerialBeta = -90;     if(SerialBeta > 90) SerialBeta = 90;
    if(SerialAlpha < -180) SerialAlpha = -180; if(SerialAlpha > 0) SerialAlpha = 0;
    
    pSerialAlpha++;if(pSerialAlpha < 0 || pSerialAlpha > pSerialBufferLength){pSerialAlpha = 0;}
    pSerialBeta++; if(pSerialBeta < 0  || pSerialBeta > pSerialBufferLength) {pSerialBeta = 0;}
    pSerialGamma++;if(pSerialGamma < 0 || pSerialGamma > pSerialBufferLength){pSerialGamma = 0;}
    
    //console.log( (SerialAlpha - SerialAlphaLast) + " " + (SerialBeta - SerialBetaLast) + " " + (SerialGamma - SerialGammaLast));
    //if(isNaN(SerialAlphaLast)){ SerialAlphaLast = SerialAlpha;}
    //if(isNaN(SerialBetaLast)){ SerialBetaLast = SerialBeta;}
    //if(isNaN(SerialGammaLast)){ SerialGammaLast = SerialGamma;}
	    
    if( (SerialAlpha - SerialAlphaLast) < 3 && (SerialAlpha - SerialAlphaLast) > -3) 
    {
    	  dateSerialAlpha[pSerialAlpha] =  SerialAlphaLast;
    }
    else
    {
	  dateSerialAlpha[pSerialAlpha] =  SerialAlpha;   
    	  //dateSerialAlpha[pSerialAlpha] =  SerialAlphaLast + (SerialAlpha - SerialAlphaLast)/5;
    }  
    
    if( (SerialBeta - SerialBetaLast) < 6 && (SerialBeta - SerialBetaLast) > -6)
    {
    	  dateSerialBeta[pSerialBeta]   =  SerialBetaLast;
    }
    else
    {
	  dateSerialBeta[pSerialBeta]   =    SerialBeta;
    	  //dateSerialBeta[pSerialBeta]   =  SerialBetaLast + (SerialBeta - SerialBetaLast)/5;
    }

    
    if( (SerialGamma - SerialGammaLast) < 3 && (SerialGamma - SerialGammaLast) > -3)  
    {
    	  dateSerialGamma[pSerialGamma] =  SerialGammaLast;
    }
    else
    {
	  dateSerialGamma[pSerialGamma] = SerialGamma;
    	  //dateSerialGamma[pSerialGamma] =  SerialGammaLast  + (SerialGamma - SerialGammaLast)/5;
    }

    //console.log( "Release 3" );	     
    //console.log( "NOW" + (SerialAlpha) + " " + (SerialBeta) + " " + (SerialGamma));	
    //console.log( "LST" + (SerialAlphaLast) + " " + (SerialBetaLast) + " " + (SerialGammaLast));	    
	    
    pSerialAlphaMax = 0;
    pSerialAlphaMin = 0;
    pSerialBetaMax  = 0;
    pSerialBetaMin  = 0;
    pSerialGammaMax = 0;
    pSerialGammaMin = 0;
    
    for(var j=1; j < pSerialBufferLength; j++)
    {
        if(dateSerialAlpha[pSerialAlphaMin] > dateSerialAlpha[j])
      	{
      	    pSerialAlphaMin = j;  
      	}	
      	if(dateSerialAlpha[pSerialAlphaMax] < dateSerialAlpha[j])
      	{
      	    pSerialAlphaMax = j; 
      	}	
      	if(dateSerialBeta[pSerialBetaMin] > dateSerialBeta[j])
      	{
      	    pSerialBetaMin = j;  
      	}	
      	if(dateSerialBeta[pSerialBetaMax] < dateSerialBeta[j])
      	{
      	    pSerialBetaMax = j; 
      	}	
      	if(dateSerialGamma[pSerialBetaMin] > dateSerialGamma[j])
      	{
      	    pSerialGammaMin = j;  
      	}	
      	if(dateSerialGamma[pSerialGammaMax] < dateSerialGamma[j])
      	{
      	    pSerialGammaMax = j; 
      	}	
    }
    
    /* Fushion for SerialAlpha */ 
    tsum = 0;
    tcount = 0;
    tvector = 0;
    for(j=0; j < pSerialBufferLength; j++)
    {
      	 if(j!=pSerialAlphaMin &&  j!=pSerialAlphaMax)
      	 {
      	     tvector = tvector + parseInt(dateSerialAlpha[j]); 
      	     if(dateSerialAlpha[j] < 0)
      	     {
      	          tsum = tsum - parseInt(dateSerialAlpha[j]);	
      	     }
      	     else
      	     {	
      	          tsum = tsum + parseInt(dateSerialAlpha[j]);
      	     } 
      	     tcount++; 
      	  }	
    }	
    tsum = tsum / tcount;
    tsum = tsum.toFixed(2);
    if(tvector > 0)
    {
      	  SerialAlpha = tsum;
    }
    else
    {
      	  SerialAlpha = -tsum;
    }

    /* Fushion for SerialBeta */  
    tsum = 0;
    tcount = 0;
    tvector = 0;
    for(j=0; j < pSerialBufferLength; j++)
    {
      	 if(j!=pSerialBetaMin &&  j!=pSerialBetaMax)
      	 {
      	     tvector = tvector + parseInt(dateSerialBeta[j]); 
      	     if(dateSerialBeta[j] < 0)
      	     {
      	          tsum = tsum - parseInt(dateSerialBeta[j]);	
      	     }
      	     else
      	     {	
      	          tsum = tsum + parseInt(dateSerialBeta[j]);
      	     } 
      	     tcount++; 
      	  }	
    }	
    tsum = tsum / tcount;
    tsum = tsum.toFixed(2);
    if(tvector > 0)
    {
      	  SerialBeta = tsum;
    }
    else
    {
      	  SerialBeta = -tsum;
    }
    
    /* Fushion for SerialGamma */  
    tsum = 0;
    tcount = 0;
    tvector = 0;
    for(j=0; j < pSerialBufferLength; j++)
    {
      	 if(j!=pSerialGammaMin &&  j!=pSerialGammaMax)
      	 {
      	     tvector = tvector + parseInt(dateSerialGamma[j]); 
      	     if(dateSerialGamma[j] < 0)
      	     {
      	          tsum = tsum - parseInt(dateSerialGamma[j]);	
      	     }
      	     else
      	     {	
      	          tsum = tsum + parseInt(dateSerialGamma[j]);
      	     } 
      	     tcount++;
      	  }
    }
    tsum = tsum / tcount;
    tsum = tsum.toFixed(2);
    if(tvector > 0)
    {
      	  SerialGamma = tsum;
    }
    else
    {
      	  SerialGamma = -tsum;
    }
    
    SerialAlphaLast = SerialAlpha;
    SerialBetaLast =  SerialBeta;
    SerialGammaLast = SerialGamma;
    //console.log("IMU" + SerialAlpha + " " + SerialBeta + " " + SerialGamma);
    }
    }
   
        this.onReceive(result.data);
        readLoop();
      }, error => {
        this.onReceiveError(error);
      });
    };

    return this.device_.open()
        .then(() => {
          if (this.device_.configuration === null) {
            return this.device_.selectConfiguration(1);
          }
        })
        .then(() => this.device_.claimInterface(2))
        .then(() => this.device_.selectAlternateInterface(2, 0))
        .then(() => this.device_.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': 0x22,
            'value': 0x01,
            'index': 0x02}))
        .then(() => {
          readLoop();
        });
  };

  serial.Port.prototype.disconnect = function() {
    return this.device_.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': 0x22,
            'value': 0x00,
            'index': 0x02})
        .then(() => this.device_.close());
  };

  serial.Port.prototype.send = function(data) {
    return this.device_.transferOut(4, data);
  };
})();
