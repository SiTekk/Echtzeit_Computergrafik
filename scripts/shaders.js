async function createShaderProgram(gl, vertexShaderUrl, fragmentShaderUrl) {

    let shaderSource;
    shaderSource = await loadFile(vertexShaderUrl);
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, shaderSource);
    shaderSource = await loadFile(fragmentShaderUrl);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, shaderSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram,)}`,
        );
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {

    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        if (type === gl.VERTEX_SHADER) {
            alert(
                `An error occurred compiling the vertex shader: ${gl.getShaderInfoLog(shader)}`,
            );
        }

        else {
            alert(
                `An error occurred compiling the fragment shader: ${gl.getShaderInfoLog(shader)}`,
            );
        }

        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

async function loadFile(url) {
    try {
      const response = await fetch(url);
      return await response.text();
    } catch (err) {
      console.error(err);
    }
}

export { createShaderProgram };