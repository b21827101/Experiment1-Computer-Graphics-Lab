"use strict";

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gl;
var type;
var normalize;
var stride;
var offset;

var program;
main();


function main() {
    const canvas = document.querySelector("#glcanvas"); //canvas element
    gl = canvas.getContext("webgl2");

    if(!gl) {
        alert("WebGL 2.0 is not available."); //if it fail,alert it
        return;
    }

    program = initShaderProgram(gl, vsSource, fsSource);
    gl.useProgram(program);//tell webgl use program when drawing it

    const posOfLeftEye = [];
    const posOfRightEye = [];
    const posOfYellowCircle = [];

    const eyeColor =[]; //black
    const skinColor =[]; //yellow

    const eyeRadius = 0.12; //for small circle
    const faceRadius =0.83;  //for big circle

    const maskColor =[]; //white mask color

    const upperBezier=[-0.55, 0, 0.0, 0.3, 0.55, 0]; //upper curve of mask
    const bottomBezier =[-0.55, -0.55, 0.0, -0.85, 0.55, -0.55];//lower curve of mask


    const posOfUpperCurve = [];
    const posOfBottomCurve = [];

    const curveForfirstLine = [];
    const curveForsecondLine = [];
    const curveForthirdLine = [];
    const curveForfourthLine = [];

    //Position of white mask
    /*0. index : maskenin pozisyonları
     * 1. index: sol üst maske
     * 2.index : sağ üst maske
     * 3.index: sol alt maske
     * 4. index: sağ alt maske
     */

    const posOfMask = [[upperBezier[0], upperBezier[1],upperBezier[4], upperBezier[5],bottomBezier[4], bottomBezier[5],bottomBezier[0], bottomBezier[1]],
        [-0.817, 0.15, upperBezier[0], upperBezier[1],  upperBezier[0], -0.08,-0.827, 0.07],
        [upperBezier[4], upperBezier[5], 0.817, 0.15, 0.827, 0.07, 0.55, -0.08],
        [-0.625, -0.55, -0.55,  -0.47,bottomBezier[0], bottomBezier[1], -0.586, -0.59],
        [0.55, -0.47,0.625, -0.55,  0.586, -0.59, bottomBezier[4], bottomBezier[5]]
    ];

    //for curve lines of mask
    const curveOfLineMask =[[posOfMask[1][0],posOfMask[1][1],-0.829,0.11 ,posOfMask[1][6],posOfMask[1][7]],
        [posOfMask[2][2],posOfMask[2][3], 0.829, 0.11 , posOfMask[2][4],posOfMask[2][5]],
        [posOfMask[3][0],posOfMask[3][1],-0.605, -0.57, posOfMask[3][6],posOfMask[3][7]],
        [posOfMask[4][2],posOfMask[4][3], 0.605, -0.57, posOfMask[4][4],posOfMask[4][5]]];


    type = gl.FLOAT;
    normalize = false;
    stride = 0;
    offset = 0;


    gl.viewport(0,0,canvas.width,canvas.height);

    gl.clearColor(1,1,1,1.0); //color the background white
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);// Clear the canvas before we start drawing on it.

    //to draw circles
    drawScene(toCircle(gl,posOfYellowCircle,skinColor,0,0,faceRadius),0,101);
    drawScene(toCircle(gl,posOfLeftEye,eyeColor,-0.315,0.32,eyeRadius),0,101);
    drawScene(toCircle(gl,posOfRightEye,eyeColor,0.315,0.32,eyeRadius),0,101);

    drawScene(toBezier(gl,posOfBottomCurve, bottomBezier, maskColor),0, posOfBottomCurve.length / 2);
    drawScene(toBezier(gl,posOfUpperCurve, upperBezier, maskColor),0, posOfUpperCurve.length / 2);

    drawScene(toSquare(gl, posOfMask[0],maskColor),0, 4); //middle of the mask

    drawScene(toSquare(gl, posOfMask[1],maskColor),0, 4);//each of them is line of mask
    drawScene(toBezier(gl,curveForfirstLine,curveOfLineMask[0],maskColor),0, curveForfirstLine.length / 2);

    drawScene(toSquare(gl, posOfMask[2],maskColor),0, 4);
    drawScene(toBezier(gl,curveForsecondLine,curveOfLineMask[1],maskColor),0, curveForsecondLine.length / 2);

    drawScene(toSquare(gl, posOfMask[3],maskColor),0, 4);
    drawScene(toBezier(gl,curveForthirdLine,curveOfLineMask[2],maskColor),0, curveForthirdLine.length / 2);

    drawScene(toSquare(gl, posOfMask[4],maskColor),0, 4);
    drawScene(toBezier(gl,curveForfourthLine,curveOfLineMask[3],maskColor),0, curveForfourthLine.length / 2);

}

function drawScene(buffer,offset, NumVertices){

    const aPosition = gl.getAttribLocation(program, "a_position");// Get the location of the shader variables
    const aColor = gl.getAttribLocation(program, "vColor");

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.enableVertexAttribArray(aPosition);  // Enable the assignment to aPosition variable
    gl.vertexAttribPointer(aPosition, 2, type, normalize, stride, offset); // Assign the buffer object to aPosition variable

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
    gl.enableVertexAttribArray(aColor);// Enable the assignment to aColor variable
    gl.vertexAttribPointer( aColor,4,type,normalize,stride,offset);

    gl.drawArrays(gl.TRIANGLE_FAN, offset, NumVertices); //draw them
}



