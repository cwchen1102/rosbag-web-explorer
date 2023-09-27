import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [fileStatus, setFileStatus] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileContext, setFileContext] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get('/api/files/');
      setUploadedFiles(response.data);
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    setProgress(0);
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(file);

    const isRosbag = file.name.toLowerCase().endsWith('.bag');
    if (isRosbag) {
      setFileStatus(null);
      const form_data = new FormData();
      form_data.append('file', file, file.name);
  
      const url = '/api/files/';
      axios.post(url, form_data, {
        headers: {
          'content-type': 'multipart/form-data'
        }, onUploadProgress
      })
        .then(response => {
          console.log(response.data);
          fetchUploadedFiles();
        })
        .catch(error => console.log(error));
    } else {
      setFileStatus('Fail to submit. Please choose a rosbag file.');
    }
  };

  const onUploadProgress = event => {
    const percentCompleted = Math.round((event.loaded * 100) / event.total);
    setProgress(percentCompleted);
    console.log('onUploadProgress', percentCompleted);
  };

  const exploreFiles = (url, id) => {
    axios.get(`/api/files/${id}/rosbag/`)
      .then(response => {
        setFileContext(response.data);
        console.log(response.data);
      })
      .catch(error => console.log(error));
  };

  const downloadFiles = (url, id) => {
    axios({
      method: 'get',
      url,
      responseType: 'blob'
    })
      .then(response => {
        const href = window.URL.createObjectURL(response.data);
        const anchorElement = document.createElement('a');
        anchorElement.href = href;
        anchorElement.download = id;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
      })
      .catch(error => console.log(error));
  };

  const deleteFiles = (url, id) => {
    axios.delete(`/api/files/${id}/`)
      .then(response => {
        console.log('File delete');
        fetchUploadedFiles();
      })
      .catch(error => console.log(error));
  };

  const renderUploadedFiles = () => {
    return uploadedFiles.map(file => (
      <tr key={file.id}>
        <td>{file.file}</td>
        <td>
          <button onClick={() => exploreFiles(file.file, file.id)} className="btn btn-info">Explore</button>
        </td>
        <td>
          <button onClick={() => downloadFiles(file.file, file.id)} className="btn btn-success">Download</button>
        </td>
        <td>
          <button onClick={() => deleteFiles(file.file, file.id)} className="btn btn-danger">Delete</button>
        </td>
      </tr>
    ));
  };

  const renderFileContext = () => {
    const renderList = (value) => {
      return value.map((v, index) => (
        <tr key={index}>
          <td>{v.topic}</td>
          <td>{v.msg_type}</td>
          <td>{v.message_count}</td>
          <td>{v.connections}</td>
          <td>{v.frequency}</td>
        </tr>
      ));
    };

    const renderData = (key, value) => {
      if (Array.isArray(value)) {
        return (
          <tr key={key}>
            <th>{key}</th>
            <td>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Topic Name</th>
                    <th scope="col">Messsage Type</th>
                    <th scope="col">Message Count</th>
                    <th scope="col">Connections</th>
                    <th scope="col">Frequency</th>
                  </tr>
                </thead>
                <tbody>{renderList(value)}</tbody>
              </table>
            </td>
          </tr>
        );
      } else if (typeof value === 'object') {
        return (
          <tr key={key}>
            <th>{key}</th>
            <td>
              <table className="table table-bordered">
                <tbody>{renderFileContext(value)}</tbody>
              </table>
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={key}>
            <th>{key}</th>
            <td>{value}</td>
          </tr>
        );
      }
    };

    return (
      <tbody>
        {Object.entries(fileContext).map(([key, value]) => (
          renderData(key, value)
        ))}
      </tbody>
    );
  };




  return (
    <div className="container-fluid">
      <h1 className="text-center alert alert-primary mt-2">Rosbag Web Explorer</h1>
      <div className="row">
        <div className="col-md-8">
          <h2 className="alert alert-success">Uploaded Rosbags</h2>
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th scope="col">File Path</th>
                <th scope="col">Explore Rosbag</th>
                <th scope="col">Download</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {renderUploadedFiles()}
            </tbody>
          </table>
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th scope="col">Explore Results</th>
              </tr>
            </thead>
            {renderFileContext()}
          </table>
        </div>
        <div className="col-md-4">
          <h2 className="alert alert-success">Upload Section</h2>
          <form onSubmit={handleSubmit}>
            <input type="file" id="file" onInput={handleFileChange} className="form-control" required />
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: progress + "%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{`${progress}%`}</div>
            </div>
            <div>{fileStatus}</div>
            <button className="btn btn-primary float-left mt-2">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
