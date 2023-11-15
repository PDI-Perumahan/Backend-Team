const express = require('express');
const app = express();
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
// set up supabase
const supabaseUrl = 'https://pvxecgbeybcpljckgujd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2eGVjZ2JleWJjcGxqY2tndWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYwNjQ5NjUsImV4cCI6MjAxMTY0MDk2NX0.-T2VqHiqxpX-4pjvPDp4DVUKfPoEb4A0oXDG_Qt3Fbo';
const supabase = createClient(supabaseUrl, supabaseKey);

// set up gcp bucket
const serviceAccount = {
  "type": "service_account",
  "project_id": "spheric-basis-381509",
  "private_key_id": "8d2614986010a98a5ce62cb123382edc67206155",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDdphEaSHoxwavY\noNuT1sPwYZ4lXCmSATgkf9iyrRPnQ185lVO08tHFJgfQWTtPm1FocPVVF5F3sr4G\nNoF1AARDc8RGZDVkwvXdQerYCpsP51Jr6Z465WyOiV6CD3aqsqzmwaVaW/XDpfdP\naLVBZjYEgvtxCY49vZ8nrgR1AVR8aR+vD3Kie3MAhGKYd8lSBLqksaadIRph76KU\nJCHnDwNBYnZFbCVako2TXYllefg7M8NX8MQR7GydzU32F3fnsM/zXCOAJGv3MT9Y\nlhAW18y1DP6grPU/iYfNFceRdyOHpb2MZgwcNyiOOsZGj2sEOAORGHE6PJfjOFNc\nVQhhmooXAgMBAAECggEAEJo427wkEwgLxD1AVVGX+bCGNQwzPPGEcA93fuLCA+ej\nAWAzFfG+TsMrgKq+a5cZwPX9GnOafNnRrAt3JPlsWFUalZ859KM54Wnnmmko9kcA\ngH7OUGERAZg+kQVxgRXDJ8HHjf4naZFL9hHEyfJLB4l8JhpuIifK/SDmypDf8DWX\n7NuTE8ggLlMoR0NCkTY9MklYyt33mvLuK3LT8ZebosV5niKJDFsWDR+ONMyhaxsH\nR2WXHybTdkGti6s5V4zTwMWaX/G1MAPCBinwRdTCA7mXwtwx3YP2MREwBQ2JnMPC\nuwtRxV0eYrCzzNitfGfNzuXfZH/hQnfhJtM9Gpu7CQKBgQDz5CGsDqpIfU6tki4Q\nloJjLL5kieiKhaVQfuytjfmwWX/YMJA6hKckWqN1e0frWZ52rKgUyeOzn3odFwOm\nU93SFpJPxWhrVOM+2xz6pcJ/0uIUk7X1NF7CxGbiMdIi+RXFUfaJ5zWOy1uYuvQs\nEpuO7SRYpGo2Q6IcXuYIFWrkxQKBgQDopzuV51lvA1KQ97XV6U5hPsQ3Ki3YxPOk\ngsgzMRu57sNcIhjRZHz9eHk9QCVQiEfWh3bcnMdzvDFN5n6ell7kVI5r7JWqf4Yq\nG/TCOUg0tpdpRVcgFAqb4wMCCweU2mt92C8dNfNggu6xWYSzO2MUmOoe0t/L1T2v\neEbMQsF5KwKBgDe4jkzeCN+I6XnUZPvbNyzrYxBbRaqoQA21AePhBQPaXtAIwFru\nRbWTk7balKLblc2tQrWFLqWyMNcGlAnjLVG7YHAjPOkQut54dxV424gSqR5kZPUB\nowjCkHLrSQQ+fk/XmwkErwLRyTqKtBCBq9KqsVwjLDT7nMT4lXuRURu1AoGAL+cv\nF6B5A6iVeY/netH893zq/cjLg9SZrgfXnOLBqLkGtJO4tHSSX8ZMgFYS2NAWqo9d\n4/LMBoJ7TGTnMVQY2b6nTIV8E40KXOVAsjUFLwVhi6VhWROHU62cUvFecEHA3DqF\nCOiw4fBToWSjNBxIPFd37TzSI7AWcWi8exZLq90CgYEA226DHRGrOfvAuX1pCu9i\nc7X6mziYflMu9/IPy0DPxw9xbfqHLWZ+ltPJXOFGNl/hEwfHzi7gCMiHCTEJ7tjm\nDxOD54NSwnHEylLlMKtA6Rvxwyy0pF4vKYGtV1ALkKaMxdoUGsXMlKi3LSIvBqh3\n89Xy9IZDS8q6XDNCgJo1pFo=\n-----END PRIVATE KEY-----\n",
  "client_email": "protel-pdiperumahan@spheric-basis-381509.iam.gserviceaccount.com",
  "client_id": "111022419962554166559",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/protel-pdiperumahan%40spheric-basis-381509.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com",
};
const storage = new Storage({
  credentials: serviceAccount,
});
const bucketName = 'env-protel';
const bucket = storage.bucket(bucketName);

const upload = multer({ dest: 'uploads/'});
// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Selamat datang di PDI Perumahan');
});

app.get('/3DObject', async (req, res) => {
  let { data: objects, error } = await supabase.from('3D_Object').select('*');
  if (error) return res.status(500).json({ error: 'Internal server error' });

  res.json(objects);
});

app.get('/3DObject/:objectid', async (req,res) => {
  const { objectid } = req.params;
  try {
    let { data, error } = await supabase
    .from('3D_Object')
    .select('*')
    .eq('objectid', objectid);

    if (error) throw new Error(error.message);

    if (data.length === 0) {
      return res.status(404).json({ message: 'No data ditemukan'});
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error'})
  }
});

app.post('/3DObject', async(req, res) => {
  try{
    const { userid, objectid, LinkApi1,  DateCreated, ThreeDid } = req.body;

    console.log(req.body);

    if(!LinkApi1) {
      return res.status(400).json({ error: "Link Api is required"});
    }

    let { data, error } = await supabase.from('3D_Object').insert([
      { userid, objectid, LinkApi1, DateCreated, ThreeDid },
    ]);
    
    if (error) throw new Error(error.message);
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/3DDimension', async (req, res) => {
  const { ThreeDid, ScaleX, ScaleY, ScaleZ} = req.body;
  try{
    const {data, error} = await supabase
      .from('3D_Dimension')
      .insert([{ ThreeDid, ScaleX, ScaleY, ScaleZ}]);
      if (error) throw error;
      res.status(200).json({ message: 'Data inserted'});
  } catch (error) {
    res.status(500).json({ error: 'error'});
  }
});

app.get('/3DDimension', async (req, res) => {
  try{
    const { data, error } = await supabase.from('3D_Dimension').select('*');
    if(error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'error retrieving data'})
  }
});

app.post('/3DEnv', async (req, res) => {
  const { envid, userid, DateCreated, LinkApi1 } = req.body;
  try{
    const {data, error} = await supabase
      .from('3D_Environment')
      .insert([{ envid, userid, DateCreated, LinkApi1 }]);
      if (error) throw error;
      res.status(200).json({ message: 'Data inserted'});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message});
  }
});

app.get('/3DEnv', async (req, res) => {
  try{
    const { data, error } = await supabase.from('3D_Environment').select('*');
    if(error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'error retrieving data'})
  }
});

app.post('/DataEnv', async (req, res) => {
  const { dataenvid, userid, envid } = req.body;
  try{
    const {data, error} = await supabase
      .from('Data_Env')
      .insert([{ dataenvid, userid, envid }]);
      if (error) throw error;
      res.status(200).json({ message: 'Data inserted'});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message});
  }
});

app.get('/DataEnv/env/:userid', async (req,res) => {
  const { userid } = req.params;
  try {
    let { data, error } = await supabase
    .from('Data_Env')
    .select('envid')
    .eq('userid', userid);

    if (error) throw new Error(error.message);

    if (data.length === 0) {
      return res.status(404).json({ message: 'No data ditemukan'});
    }

    const envids = data.map((item) => item.envid);

    res.json(envids);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error'})
  }
});

app.get('/DataEnv/user/:envid', async (req,res) => {
  const { envid } = req.params;
  try {
    let { data, error } = await supabase
    .from('Data_Env')
    .select('userid')
    .eq('envid', envid);

    if (error) throw new Error(error.message);

    if (data.length === 0) {
      return res.status(404).json({ message: 'No data ditemukan'});
    }

    const userids = data.map((item) => item.userid);

    res.json(userids);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error'})
  }
});

app.get('/DataEnv', async (req, res) => {
  try{
    const { data, error } = await supabase.from('Data_Env').select('*');
    if(error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'error retrieving data'})
  }
});

app.post('/DataObj', async (req, res) => {
  const { dataobjectid, userid, objectid } = req.body;
  try{
    const {data, error} = await supabase
      .from('Data_Object')
      .insert([{ dataobjectid, userid, objectid }]);
      if (error) throw error;
      res.status(200).json({ message: 'Data inserted'});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message});
  }
});

app.get('/DataObj/object/:userid', async (req,res) => {
  const { userid } = req.params;
  try {
    let { data, error } = await supabase
    .from('Data_Object')
    .select('objectid')
    .eq('userid', userid);

    if (error) throw new Error(error.message);

    if (data.length === 0) {
      return res.status(404).json({ message: 'No data ditemukan'});
    }

    const objectids = data.map((item) => item.objectid);

    res.json(objectids);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error'})
  }
});

app.get('/DataObj/users/:objectid', async (req,res) => {
  const { objectid } = req.params;
  try {
    let { data, error } = await supabase
    .from('Data_Object')
    .select('userid')
    .eq('objectid', objectid);

    if (error) throw new Error(error.message);

    if (data.length === 0) {
      return res.status(404).json({ message: 'No data ditemukan'});
    }

    const userids = data.map((item) => item.userid);

    res.json(userids);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error'})
  }
});

app.get('/DataObj', async (req, res) => {
  try{
    const { data, error } = await supabase.from('Data_Object').select('*');
    if(error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'error retrieving data'})
  }
});

app.post('/Env/Uploads', upload.single('envfile'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const { envid, userid } = req.body; // Extract envid and userid from the request body
    const uploadPath = `env/${envid}/${originalname}`;

    await bucket.upload(path, {
      destination: uploadPath,
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    console.log(`${path} uploaded to ${bucketName} as ${uploadPath}.`);

    const fullUrl = `https://storage.googleapis.com/${bucketName}/${uploadPath}`;

    // Save envid, userid, and file path to Data_Env table
    const { data: dataEnv, error: errorEnv } = await supabase
      .from('Data_Env')
      .insert([{ envid, userid, urlFileEnv: fullUrl }]); // Save the relative path, not the full URL

    if (errorEnv) {
      console.error('Error saving to Data_Env table:', errorEnv);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json({ message: 'File telah diupload', fullUrl });
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/Env/all', async (req, res) => {
  try{
    const { data, error } = await supabase.from('Data_Env').select('urlFileEnv');
    if(error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'error retrieving data'})
  }
});

app.get('/Env/:envid', async (req, res) => {
  const { envid } = req.params;

  try {
    // Fetch the corresponding URL from Data_Env table based on envid
    let { data, error } = await supabase
      .from('Data_Env')
      .select('urlFileEnv')
      .eq('envid', envid)
      .single();

    if (error) throw new Error(error.message);

    if (!data) {
      return res.status(404).json({ message: 'File not found for the provided envid' });
    }

    const urlFileEnv = data.urlFileEnv;

    // Send the public URL directly
    res.json({ publicUrl: urlFileEnv });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/Obj/Uploads', upload.single('objfile'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const { objectid, userid } = req.body; // Extract objectid and userid from the request body
    const uploadPath = `obj/${objectid}/${originalname}`;

    await bucket.upload(path, {
      destination: uploadPath,
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    console.log(`${path} uploaded to ${bucketName} as ${uploadPath}.`);

    // Get a signed URL for the uploaded file
    const [url] = await bucket.file(uploadPath).getSignedUrl({
      action: 'read',
      expires: '01-01-2100', // Set an expiration date far in the future
    });

    if (!url) {
      console.error('Public URL not found for the file');
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Save objectid, userid, and file URL to Data_Object table
    const { data: dataObject, error: errorObject } = await supabase
      .from('Data_Object')
      .insert([{ objectid, userid, urlFileObject: url }]);

    if (errorObject) {
      console.error('Error saving to Data_Object table:', errorObject);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json({ message: 'File telah diupload' });
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/Obj/all', async (req, res) => {
  try{
    const { data, error } = await supabase.from('Data_Object').select('urlFileObject');
    if(error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'error retrieving data'})
  }
});

app.get('/Obj/:objectid', async (req, res) => {
  const { objectid } = req.params;

  try {
    // Fetch the corresponding URL from Data_Env table based on envid
    let { data, error } = await supabase
      .from('Data_Object')
      .select('urlFileObject')
      .eq('objectid', objectid)
      .single();

    if (error) throw new Error(error.message);

    if (!data) {
      return res.status(404).json({ message: 'File not found for the provided objectid' });
    }

    const urlFileObject = data.urlFileObject;

    // Send the public URL directly
    res.json({ publicUrl: urlFileObject });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
