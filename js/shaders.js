
// Vertex shader program
const vsSource = `#version 300 es
    in vec4 a_position;
    in vec4 vColor;
    out vec4 fColor;
    void main()
    {
        fColor = vColor;
        gl_Position = a_position;
    }
`;

// Fragment shader program
const fsSource = `#version 300 es
    precision mediump float;
    in vec4 fColor;
    out vec4 fragColor;

    void main()
    {
        fragColor = fColor;
    }
`;


