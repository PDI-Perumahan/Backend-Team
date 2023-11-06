const express = require('express');
const app = express();
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
// set up supabase
const supabaseUrl = 'https://pvxecgbeybcpljckgujd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2eGVjZ2JleWJjcGxqY2tndWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYwNjQ5NjUsImV4cCI6MjAxMTY0MDk2NX0.-T2VqHiqxpX-4pjvPDp4DVUKfPoEb4A0oXDG_Qt3Fbo';
const supabase = createClient(supabaseUrl, supabaseKey);

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

app.get('/DataObj', async (req, res) => {
  try{
    const { data, error } = await supabase.from('Data_Object').select('*');
    if(error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'error retrieving data'})
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
