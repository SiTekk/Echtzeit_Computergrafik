export class AttributeDescription { // Class which contains the attribute desciptions for the shaders
    constructor(location, size, offset, isInstanced = false) {
        this.location = location;
        this.size = size;
        this.offset = offset;
        this.isInstanced = isInstanced;
    }
}

export class GameObject
{
    constructor(vao, coordinates, texture)
    {
        this.vao = vao;
        this.coordinates = coordinates;
        this.texture = texture;
    }
}

export const global =
{
    vertices: // Holds the Values for a standard Cube
    [   // Position      // Normal        // Color       // TextureCoord
        0.0, 0.0,  0.0,  0.0,  0.0,  1.0, 1.0, 0.0, 0.0, -1.0, -1.0, -1.0, // Front
        1.0, 0.0,  0.0,  0.0,  0.0,  1.0, 1.0, 0.0, 0.0,  1.0, -1.0, -1.0,
        1.0, 1.0,  0.0,  0.0,  0.0,  1.0, 1.0, 0.0, 0.0,  1.0,  1.0, -1.0,
        0.0, 1.0,  0.0,  0.0,  0.0,  1.0, 1.0, 0.0, 0.0, -1.0,  1.0, -1.0,

        0.0, 1.0,  0.0,  0.0,  1.0,  0.0, 1.0, 0.0, 0.0, -1.0,  1.0, -1.0, // Up
        1.0, 1.0,  0.0,  0.0,  1.0,  0.0, 1.0, 0.0, 0.0,  1.0,  1.0, -1.0,
        1.0, 1.0, -1.0,  0.0,  1.0,  0.0, 1.0, 0.0, 0.0,  1.0,  1.0,  1.0,
        0.0, 1.0, -1.0,  0.0,  1.0,  0.0, 1.0, 0.0, 0.0, -1.0,  1.0,  1.0,

        0.0, 0.0, -1.0,  0.0, -1.0,  0.0, 1.0, 0.0, 0.0, -1.0, -1.0,  1.0, // Down
        1.0, 0.0, -1.0,  0.0, -1.0,  0.0, 1.0, 0.0, 0.0,  1.0, -1.0,  1.0,
        1.0, 0.0,  0.0,  0.0, -1.0,  0.0, 1.0, 0.0, 0.0,  1.0, -1.0, -1.0,
        0.0, 0.0,  0.0,  0.0, -1.0,  0.0, 1.0, 0.0, 0.0, -1.0, -1.0, -1.0,

        0.0, 0.0, -1.0, -1.0,  0.0,  0.0, 1.0, 0.0, 0.0, -1.0, -1.0,  1.0, // Left
        0.0, 0.0,  0.0, -1.0,  0.0,  0.0, 1.0, 0.0, 0.0, -1.0, -1.0, -1.0,
        0.0, 1.0,  0.0, -1.0,  0.0,  0.0, 1.0, 0.0, 0.0, -1.0,  1.0, -1.0,
        0.0, 1.0, -1.0, -1.0,  0.0,  0.0, 1.0, 0.0, 0.0, -1.0,  1.0,  1.0,

        1.0, 0.0,  0.0,  1.0,  0.0,  0.0, 1.0, 0.0, 0.0,  1.0, -1.0, -1.0, // Right
        1.0, 0.0, -1.0,  1.0,  0.0,  0.0, 1.0, 0.0, 0.0,  1.0, -1.0,  1.0,
        1.0, 1.0, -1.0,  1.0,  0.0,  0.0, 1.0, 0.0, 0.0,  1.0,  1.0,  1.0,
        1.0, 1.0,  0.0,  1.0,  0.0,  0.0, 1.0, 0.0, 0.0,  1.0,  1.0, -1.0,

        1.0, 0.0, -1.0,  0.0,  0.0, -1.0, 1.0, 0.0, 0.0,  1.0, -1.0,  1.0, // Back
        0.0, 0.0, -1.0,  0.0,  0.0, -1.0, 1.0, 0.0, 0.0, -1.0, -1.0,  1.0,
        0.0, 1.0, -1.0,  0.0,  0.0, -1.0, 1.0, 0.0, 0.0, -1.0,  1.0,  1.0,
        1.0, 1.0, -1.0,  0.0,  0.0, -1.0, 1.0, 0.0, 0.0,  1.0,  1.0,  1.0,
    ],
    indices: // Indices for a standard Cube
    [
         0,  2,  1,  0,  3,  2, // Front
         4,  6,  5,  4,  7,  6, // Up
         8, 10,  9,  8, 11, 10, // Down
        12, 14, 13, 12, 15, 14, // Left
        16, 18, 17, 16, 19, 18, // Right
        20, 22, 21, 20, 23, 22  // Back
    ],
    attributeDescriptors:
    [
        new AttributeDescription(0, 3, 0),  // Position
        new AttributeDescription(1, 3, 12), // Normals
        new AttributeDescription(2, 3, 24), // Color
        new AttributeDescription(3, 3, 36), // Texel
        //new AttributeDescription(4, 3, 0, true), // Instances
    ],
    unitBoxVertices:
    [
        -1.0, -1.0, -1.0, // 0
        +1.0, -1.0, -1.0, // 1
        +1.0, +1.0, -1.0, // 2
        -1.0, +1.0, -1.0, // 3
        -1.0, -1.0, +1.0, // 4
        +1.0, -1.0, +1.0, // 5
        +1.0, +1.0, +1.0, // 6
        -1.0, +1.0, +1.0, // 7
    ],
    unitBoxIndices:
    [
        4, 5, 6, 4, 6, 7, // front
        1, 0, 3, 1, 3, 2, // back
        7, 6, 2, 7, 2, 3, // top
        0, 1, 5, 0, 5, 4, // bottom
        5, 1, 2, 5, 2, 6, // right
        0, 4, 7, 0, 7, 3, // left
    ],
    cubePositions: // The positions of the different cubes
    [
        [0.0, 0.0, 0.0],
        [2.0, 5.0, 15.0],
        [-1.5, -2.2, 2.5],
        [-3.8, -2.0, 12.3],
        [2.4, -0.4, 3.5],
        [-1.7, 3.0, 7.5],
        [1.3, -2.0, 2.5],
        [1.5, 2.0, 2.5],
        [1.5, 0.2, 1.5],
        [-1.3, 1.0, 1.5]
    ],
    quadVertices:
    [
        // positions // texCoords
        -1.0,  1.0,  0.0, 1.0,
        -1.0, -1.0,  0.0, 0.0,
         1.0, -1.0,  1.0, 0.0,

        -1.0,  1.0,  0.0, 1.0,
         1.0, -1.0,  1.0, 0.0,
         1.0,  1.0,  1.0, 1.0
    ],
    lightPosition:
    [
        -100, 0, 10
    ],
    ubo: // Holds the matrices for the translations
    {
        model: glMatrix.mat4.create(),
        view: glMatrix.mat4.create(),
        proj: glMatrix.mat4.create(),
        lightProj: glMatrix.mat4.create(),
        lightView: glMatrix.mat4.create()
    },
    cameraValues: // Holds the values for the camera
    {
        angle: 0.0,
        axis: glMatrix.vec3.fromValues(0.0, 0.0, 0.0),
        eye: glMatrix.vec3.fromValues(0.0, 4.0, 2.0),
        center: glMatrix.vec3.fromValues(0.0, -1.0, -1.0),
        up: glMatrix.vec3.fromValues(0.0, 1.0, 0.0),
        fovy: 60.0,
        near: 0.001,
        far: 1000.0
    },
    deltaTime: 0, //Variable that stores the elapsed time of two frames
    skyBoxUrls: // Holds the URLs to the Skybox cube map elements
    [
        "textures/skybox/Skybox_Right.avif",
        "textures/skybox/Skybox_Left.avif",
        "textures/skybox/Skybox_Top.avif",
        "textures/skybox/Skybox_Bottom.avif",
        "textures/skybox/Skybox_Front.avif",
        "textures/skybox/Skybox_Back.avif"
    ],
    dirtBlockUrls:
    [
        "textures/blocks/dirt_side.png",
        "textures/blocks/dirt_side.png",
        "textures/blocks/dirt_top.png",
        "textures/blocks/dirt_bottom.png",
        "textures/blocks/dirt_side.png",
        "textures/blocks/dirt_side.png"
    ],
    treeBlockUrls:
    [
        "textures/blocks/tree_side.png",
        "textures/blocks/tree_side.png",
        "textures/blocks/tree_top_bottom.png",
        "textures/blocks/tree_top_bottom.png",
        "textures/blocks/tree_side.png",
        "textures/blocks/tree_side.png"
    ],
    leaveBlockUrls:
    [
        "textures/blocks/leaves.png",
        "textures/blocks/leaves.png",
        "textures/blocks/leaves.png",
        "textures/blocks/leaves.png",
        "textures/blocks/leaves.png",
        "textures/blocks/leaves.png"
    ],
    textureLevel: 4
};
