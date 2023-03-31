export function readShaderFile(fileName) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status !== 404) {
        // return onReadShader(gl, request.responseText, shader);
        resolve(request.responseText);
      }
    }
    request.open('GET', fileName, true); // Create a request to acquire the file
    request.send();
  })
                    // Send the request
}