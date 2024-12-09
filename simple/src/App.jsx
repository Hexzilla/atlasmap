import React, { useEffect, useRef, useState } from "react";

function App() {
  const iframeRef = useRef(null);
  const [admFilePath, setAdmFilePath] = useState("");
  const [admFile, setAdmFile] = useState(null);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event) => {
      if (event.origin !== "http://localhost:3000") return; // Ensure the origin is correct
      console.log("Message from iframe:", event.data);
      exportADMArchiveFile(event.data); // Call exportADMArchiveFile with event.data
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (admFilePath) {
      fetch(admFilePath)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.arrayBuffer();
        })
        .then((buffer) => {
          const file = new File([buffer], "admFile.adm");
          setAdmFile(file);
        })
        .catch((error) => {
          console.error("Error loading ADM file:", error);
        });
    }
  }, [admFilePath]);

  const sendMessageToIframe = () => {
    if (iframeRef.current && admFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        iframeRef.current.contentWindow.postMessage(
          { fileName: admFile.name, fileData: event.target.result },
          "http://localhost:3000"
        );
      };
      reader.readAsArrayBuffer(admFile);
    } else {
      console.log("No file to send or iframe not ready.");
    }
  };

  const exportADMArchiveFile = (fileContent) => {
    console.log("Export Clicked! --- Parent");

    const url = "http://172.16.153.1/dashboard/upload.php";
    fetch(url, {
      method: "PUT",
      body: fileContent,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((_) => {
        console.log("File successfully saved to URL:", url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <input
        type="text"
        value={admFilePath}
        onChange={(e) => setAdmFilePath(e.target.value)}
        placeholder="Enter ADM file path"
      />
      <button onClick={sendMessageToIframe}>Send Message to Iframe</button>
      <iframe
        ref={iframeRef}
        src="http://localhost:3000"
        title="Example Iframe"
        width="1200px"
        height="800px"
        style={{ border: "none" }}
      />
    </div>
  );
}

export default App;
