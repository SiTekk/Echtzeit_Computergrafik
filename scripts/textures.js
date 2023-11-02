export async function createTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    let textureBlob = await fetchTextureBlob(url);
    const image = new Image();
    image.src = URL.createObjectURL(textureBlob);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    return texture;
}

async function fetchTextureBlob(url) {
    try {
      const response = await fetch(url);
      return await response.blob();
    } catch (err) {
      console.error(err);
    }
}