import React, { useEffect, useRef, useState } from "react";

const adm = [
  80, 75, 3, 4, 20, 0, 8, 8, 8, 0, 37, 1, 141, 89, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 22, 0, 0, 0, 97, 116, 108, 97, 115, 109, 97, 112, 112, 105, 110, 103,
  45, 85, 73, 46, 48, 46, 106, 115, 111, 110, 205, 148, 207, 111, 155, 48, 20,
  199, 239, 253, 43, 44, 206, 129, 18, 150, 44, 37, 167, 85, 105, 22, 165, 210,
  146, 41, 161, 187, 76, 59, 56, 96, 58, 111, 128, 45, 99, 79, 139, 170, 252,
  239, 195, 230, 135, 109, 66, 155, 170, 187, 244, 16, 161, 188, 247, 253, 62,
  30, 31, 63, 191, 167, 43, 0, 156, 91, 158, 193, 242, 11, 164, 20, 23, 143, 14,
  152, 131, 167, 42, 88, 133, 127, 149, 164, 136, 142, 20, 201, 144, 131, 137,
  7, 165, 44, 135, 212, 251, 19, 120, 150, 101, 84, 235, 19, 200, 225, 158, 8,
  22, 43, 199, 247, 166, 204, 75, 133, 100, 66, 86, 187, 175, 158, 119, 218, 61,
  106, 141, 56, 81, 150, 82, 133, 221, 233, 196, 31, 251, 126, 48, 113, 211,
  196, 247, 221, 201, 225, 48, 115, 195, 89, 48, 117, 103, 104, 156, 248, 1,
  188, 73, 199, 211, 68, 123, 11, 152, 35, 195, 173, 19, 9, 42, 99, 134, 41,
  199, 164, 80, 249, 250, 165, 32, 33, 177, 200, 81, 193, 65, 173, 7, 188, 106,
  120, 14, 238, 247, 219, 141, 182, 10, 134, 149, 69, 125, 192, 92, 118, 63,
  127, 83, 111, 154, 84, 135, 101, 191, 125, 216, 45, 150, 142, 82, 156, 192,
  143, 6, 105, 94, 19, 46, 245, 169, 232, 160, 13, 249, 194, 121, 217, 71, 85,
  195, 45, 168, 224, 159, 49, 202, 146, 21, 35, 130, 154, 175, 184, 88, 206,
  176, 141, 76, 15, 140, 37, 214, 178, 223, 90, 195, 61, 195, 57, 230, 136, 169,
  130, 192, 50, 234, 116, 213, 228, 50, 167, 252, 248, 13, 102, 2, 169, 66, 156,
  9, 212, 211, 126, 226, 109, 95, 11, 82, 196, 144, 163, 162, 250, 57, 134, 166,
  35, 216, 24, 82, 217, 239, 96, 87, 175, 154, 77, 245, 185, 103, 13, 147, 120,
  253, 246, 249, 236, 14, 33, 65, 127, 101, 17, 191, 151, 160, 144, 255, 84,
  197, 175, 83, 204, 74, 190, 145, 211, 220, 147, 168, 143, 210, 3, 20, 237,
  214, 155, 85, 95, 211, 221, 2, 93, 197, 196, 52, 122, 175, 56, 198, 207, 226,
  168, 250, 249, 127, 26, 93, 17, 123, 102, 186, 127, 167, 193, 123, 82, 15,
  144, 49, 89, 14, 17, 220, 78, 190, 250, 6, 125, 101, 132, 34, 198, 143, 231,
  44, 13, 146, 119, 219, 69, 43, 196, 168, 244, 102, 97, 120, 19, 134, 182, 88,
  131, 137, 5, 99, 213, 254, 186, 78, 69, 150, 157, 1, 186, 140, 199, 24, 149,
  193, 2, 101, 76, 26, 115, 243, 34, 205, 206, 186, 109, 237, 210, 110, 182,
  148, 23, 4, 31, 66, 255, 99, 43, 110, 33, 55, 128, 157, 140, 144, 223, 130,
  70, 240, 144, 33, 123, 201, 25, 137, 6, 187, 229, 139, 171, 45, 195, 97, 193,
  109, 83, 27, 29, 114, 208, 142, 163, 101, 105, 194, 199, 179, 109, 250, 18,
  142, 75, 52, 7, 96, 25, 201, 129, 237, 31, 221, 238, 86, 203, 232, 57, 72, 93,
  43, 15, 107, 207, 151, 162, 211, 213, 233, 31, 80, 75, 7, 8, 1, 56, 25, 6, 22,
  2, 0, 0, 185, 7, 0, 0, 80, 75, 3, 4, 20, 0, 8, 8, 8, 0, 37, 1, 141, 89, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 97, 100, 109, 45, 99, 97, 116, 97,
  108, 111, 103, 45, 102, 105, 108, 101, 115, 45, 48, 46, 103, 122, 1, 130, 2,
  125, 253, 31, 139, 8, 0, 0, 0, 0, 0, 0, 3, 205, 85, 77, 111, 226, 48, 16, 253,
  43, 81, 206, 144, 134, 44, 148, 38, 167, 101, 129, 34, 144, 22, 42, 72, 247,
  178, 233, 193, 36, 166, 245, 54, 177, 45, 199, 169, 138, 80, 254, 251, 250,
  35, 4, 39, 234, 82, 84, 46, 139, 68, 32, 51, 243, 198, 207, 111, 198, 227,
  131, 13, 223, 41, 97, 252, 39, 160, 20, 225, 231, 220, 14, 14, 246, 27, 72,
  11, 104, 7, 118, 100, 31, 162, 40, 178, 71, 60, 5, 121, 229, 151, 239, 129,
  178, 254, 201, 9, 14, 247, 20, 42, 139, 124, 32, 226, 0, 25, 153, 1, 234, 188,
  121, 78, 27, 213, 145, 143, 4, 112, 176, 33, 5, 139, 53, 236, 247, 231, 153,
  164, 83, 166, 91, 136, 223, 73, 3, 173, 18, 162, 164, 70, 229, 202, 211, 29,
  244, 221, 158, 235, 122, 253, 238, 46, 113, 221, 110, 127, 187, 29, 118, 253,
  161, 55, 232, 14, 97, 47, 113, 61, 112, 183, 235, 13, 146, 26, 142, 65, 6, 91,
  9, 78, 92, 97, 30, 51, 68, 57, 34, 184, 14, 209, 171, 91, 9, 137, 139, 12, 98,
  110, 105, 136, 197, 5, 251, 192, 90, 108, 86, 203, 26, 93, 48, 84, 163, 212,
  102, 2, 185, 147, 224, 43, 36, 79, 162, 53, 84, 218, 172, 30, 215, 227, 169,
  252, 87, 62, 169, 184, 172, 42, 225, 169, 70, 153, 81, 180, 11, 180, 22, 50,
  183, 11, 134, 48, 45, 248, 61, 130, 105, 50, 99, 164, 160, 151, 151, 191, 137,
  81, 185, 64, 44, 181, 204, 13, 54, 9, 76, 81, 134, 56, 100, 117, 22, 203, 144,
  95, 249, 4, 153, 105, 70, 249, 254, 151, 236, 73, 141, 229, 172, 128, 42, 228,
  59, 55, 9, 140, 9, 142, 1, 135, 88, 124, 13, 81, 118, 146, 199, 87, 154, 237,
  254, 8, 212, 108, 72, 60, 191, 174, 213, 16, 78, 224, 187, 202, 224, 170, 119,
  10, 248, 75, 157, 240, 102, 135, 88, 206, 151, 85, 55, 158, 136, 55, 11, 30,
  174, 231, 203, 217, 199, 189, 219, 192, 151, 157, 255, 101, 171, 189, 15, 182,
  42, 8, 92, 179, 83, 19, 94, 62, 149, 173, 46, 213, 149, 214, 165, 39, 5, 111,
  154, 47, 106, 220, 7, 70, 40, 100, 124, 127, 78, 148, 201, 106, 124, 140, 67,
  48, 119, 134, 190, 127, 231, 251, 117, 108, 115, 187, 113, 193, 152, 24, 21,
  55, 187, 34, 77, 175, 41, 112, 27, 158, 199, 196, 128, 86, 171, 24, 141, 111,
  76, 198, 106, 12, 56, 158, 247, 205, 119, 111, 77, 225, 82, 66, 94, 11, 26,
  130, 109, 10, 141, 177, 97, 88, 43, 61, 117, 116, 44, 78, 47, 7, 152, 27, 161,
  71, 83, 35, 142, 214, 210, 156, 2, 43, 219, 222, 168, 196, 249, 253, 125, 42,
  207, 63, 5, 56, 55, 52, 195, 209, 122, 54, 13, 77, 9, 26, 44, 30, 231, 142,
  171, 156, 101, 100, 139, 99, 116, 188, 27, 33, 7, 146, 180, 138, 21, 247, 162,
  62, 19, 118, 167, 181, 136, 240, 200, 43, 64, 216, 81, 82, 71, 93, 116, 114,
  36, 4, 231, 20, 170, 1, 89, 165, 154, 47, 55, 225, 104, 57, 158, 54, 124, 15,
  128, 9, 10, 98, 96, 170, 123, 90, 68, 73, 146, 40, 215, 28, 244, 100, 20, 229,
  175, 104, 255, 72, 73, 252, 42, 239, 76, 197, 253, 120, 169, 31, 34, 108, 137,
  143, 57, 50, 236, 64, 188, 46, 200, 11, 150, 218, 85, 222, 250, 152, 41, 231,
  132, 64, 195, 7, 158, 149, 217, 187, 141, 112, 41, 117, 252, 11, 43, 213, 45,
  232, 68, 8, 0, 0, 80, 75, 7, 8, 6, 74, 71, 175, 135, 2, 0, 0, 130, 2, 0, 0,
  80, 75, 3, 4, 20, 0, 8, 8, 8, 0, 37, 1, 141, 89, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 4, 0, 0, 0, 108, 105, 98, 47, 3, 0, 80, 75, 7, 8, 0, 0, 0, 0, 2, 0, 0,
  0, 0, 0, 0, 0, 80, 75, 1, 2, 20, 0, 20, 0, 8, 8, 8, 0, 37, 1, 141, 89, 1, 56,
  25, 6, 22, 2, 0, 0, 185, 7, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 97, 116, 108, 97, 115, 109, 97, 112, 112, 105, 110, 103, 45, 85,
  73, 46, 48, 46, 106, 115, 111, 110, 80, 75, 1, 2, 20, 0, 20, 0, 8, 8, 8, 0,
  37, 1, 141, 89, 6, 74, 71, 175, 135, 2, 0, 0, 130, 2, 0, 0, 22, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 90, 2, 0, 0, 97, 100, 109, 45, 99, 97, 116, 97, 108,
  111, 103, 45, 102, 105, 108, 101, 115, 45, 48, 46, 103, 122, 80, 75, 1, 2, 20,
  0, 20, 0, 8, 8, 8, 0, 37, 1, 141, 89, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 4,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 5, 0, 0, 108, 105, 98, 47, 80, 75,
  5, 6, 0, 0, 0, 0, 3, 0, 3, 0, 186, 0, 0, 0, 89, 5, 0, 0, 0, 0,
];
const targetOrigin = 'http://localhost:8001'

function App() {
  const iframeRef = useRef(null);
  const [admFilePath, setAdmFilePath] = useState("");
  const [admFile, setAdmFile] = useState(null);

  /*useEffect(() => {
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
  }, [admFilePath]);*/

  const sendMessageToIframe = () => {
    if (iframeRef.current) {
      console.log("send adm");
      const data = JSON.stringify({
        atlasmap: true,
        adm,
        source: {
          firstName: "Eric",
          lastName: "Thomas",
          age: 26,
        },
      })
      iframeRef.current.contentWindow.postMessage(data, targetOrigin);
    } else {
      console.log("No file to send or iframe not ready.");
    }
  };

  /*const exportADMArchiveFile = (fileContent) => {
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
  };*/

  const handleIframeLoad = () => {
    sendMessageToIframe(); 
  }

  return (
    <div className="App">
      <iframe
        ref={iframeRef}
        src={targetOrigin}
        title="Atlasmap"
        width="1200px"
        height="800px"
        style={{ border: "none" }}
        onLoad={handleIframeLoad}
      />
    </div>
  );
}

export default App;
