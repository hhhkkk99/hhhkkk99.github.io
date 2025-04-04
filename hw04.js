/*-------------------------------------------------------------------------
hw04.js
team: 12
name: 김휘영 (2023148033), 전희망 (2020163053)
---------------------------------------------------------------------------*/
import { resizeAspectRatio, setupText, updateText, Axes } from '../util/util.js';
import { Shader, readShaderFile } from '../util/shader.js';

let isInitialized = false;
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');
let shader;
let sunVao;
let earthVao;
let moonVao;
let axes;
let rotationAngle = 0;
let sunAngle = 0;
let earthRotationAngle = 0;
let earthOrbitAngle = 0;
let moonRotationAngle = 0;
let moonOrbitAngle = 0;
let isAnimating = true;
let lastTime = 0;
let transform;

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) {
        console.log("Already initialized");
        return;
    }

    main().then(success => {
        if (!success) {
            console.log('프로그램을 종료합니다.');
            return;
        }
        isInitialized = true;
        requestAnimationFrame(animate);
    }).catch(error => {
        console.error('프로그램 실행 중 오류 발생:', error);
    });
});

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 is not supported by your browser.');
        return false;
    }

    canvas.width = 700;
    canvas.height = 700;
    resizeAspectRatio(gl, canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2, 0.3, 0.4, 1.0);
    
    return true;
}

function setupBuffers() {
    const cubeVertices = new Float32Array([
        -0.5,  0.5,  // 좌상단
        -0.5, -0.5,  // 좌하단
         0.5, -0.5,  // 우하단
         0.5,  0.5   // 우상단
    ]);

    const indices = new Uint16Array([
        0, 1, 2,    // 첫 번째 삼각형
        0, 2, 3     // 두 번째 삼각형
    ]);

    const sunColors = new Float32Array([
        1.0, 0.0, 0.0, 1.0,  // Red
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0
    ]);

    const earthColors = new Float32Array([
        0.0, 1.0, 1.0, 1.0,  // Cyan
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0
    ])

    const moonColors = new Float32Array([
        1.0, 1.0, 0.0, 1.0,  // Yellow
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0
    ])

    sunVao = setVao(cubeVertices, indices, sunColors); // vao for Sun
    earthVao = setVao(cubeVertices, indices, earthColors); // vao for Earth
    moonVao = setVao(cubeVertices, indices, moonColors); // vao for Moon
}

function setVao(cubeVertices, indices, colors) {

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // VBO for position
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    shader.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);

    // VBO for color
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    shader.setAttribPointer("a_color", 4, gl.FLOAT, false, 0, 0);

    // EBO
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);

    return vao;
}

function getTransformMatrices() {

    // Sun transformation
    const S1 = mat4.create();
    mat4.scale(S1, S1, [0.2, 0.2, 1]); // Edge length = 0.2
    const R1 = mat4.create();
    mat4.rotate(R1, R1, sunAngle, [0, 0, 1]); // 45degree/sec 속도로 자전

    // Earth transformation
    const S2 = mat4.create();
    mat4.scale(S2, S2, [0.1, 0.1, 1]); // Edge length = 0.1
    const R2 = mat4.create();
    mat4.rotate(R2, R2, earthRotationAngle, [0, 0, 1]); // 180 degree/sec 속도로 자전
    // Sun을 중심으로 0.7 떨어져 공전
    const earthRadius = 0.7; 
    let earthX = earthRadius * Math.cos(earthOrbitAngle); 
    let earthY = earthRadius * Math.sin(earthOrbitAngle);
    const T2 = mat4.create();
    mat4.translate(T2, T2, [earthX, earthY, 0]); 

    // Moon transformation
    const S3 = mat4.create();
    mat4.scale(S3, S3, [0.05, 0.05, 1]);
    const R3 = mat4.create();
    mat4.rotate(R3, R3, moonRotationAngle, [0, 0, 1]);
    // Earth를 기준으로 Moon의 위치
    const moonRadius = 0.2;
    let moonX = moonRadius * Math.cos(moonOrbitAngle);
    let moonY = moonRadius * Math.sin(moonOrbitAngle);
    const T3 = mat4.create();
    mat4.translate(T3, T3, [moonX, moonY, 0]);

    return {S1, R1, S2, R2, T2, S3, R3, T3}
}

function applyTransform(type) {
    transform = mat4.create();
    const {S1, R1, S2, R2, T2, S3, R3, T3} = getTransformMatrices();

    if (type == "sun"){
        mat4.multiply(transform, S1, transform);
        mat4.multiply(transform, R1, transform);
    }
    else if (type == "earth"){
        mat4.multiply(transform, S2, transform);
        mat4.multiply(transform, R2, transform);
        mat4.multiply(transform, T2, transform);
    }
    else if (type == "moon") {
        mat4.multiply(transform, S3, transform);
        mat4.multiply(transform, R3, transform);
        mat4.multiply(transform, T3, transform);
        // Earth를 중심으로 공전
        mat4.multiply(transform, R2, transform);
        mat4.multiply(transform, T2, transform);
    }

    return transform;
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw axes
    axes.draw(mat4.create(), mat4.create()); 

    // draw Sun
    shader.use();
    shader.setMat4("u_model", applyTransform("sun"));
    gl.bindVertexArray(sunVao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // draw Earth
    shader.setMat4("u_model", applyTransform("earth"));
    gl.bindVertexArray(earthVao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // draw Moon
    shader.setMat4("u_model", applyTransform("moon"));
    gl.bindVertexArray(moonVao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function animate(currentTime) {

    if (!lastTime) lastTime = currentTime; // if lastTime == 0
    // deltaTime: 이전 frame에서부터의 elapsed time (in seconds)
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (isAnimating) {
        // 2초당 1회전, 즉, 1초당 180도 회전
        rotationAngle += Math.PI * deltaTime;
    
        sunAngle = rotationAngle/4; // sun rotation angle : 45 degree/sec

        earthRotationAngle = rotationAngle; // earth rotation angle : 180 degree/sec
        earthOrbitAngle = rotationAngle/6; // earth orbit angle : 30 degree/sec

        moonRotationAngle = rotationAngle; // moon rotation angle : 180 degree/sec
        moonOrbitAngle = rotationAngle * 2; // moon orbit angle : 360 degree/sec
    }
    render();

    requestAnimationFrame(animate);
}

async function initShader() {
    const vertexShaderSource = await readShaderFile('shVert.glsl');
    const fragmentShaderSource = await readShaderFile('shFrag.glsl');
    shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
}

async function main() {
    try {
        if (!initWebGL()) {
            throw new Error('WebGL 초기화 실패');
        }
        
        transform = mat4.create();
        await initShader();

        setupBuffers();
        requestAnimationFrame(animate);
        axes = new Axes(gl, 1.0); 

        return true;
    } catch (error) {
        console.error('Failed to initialize program:', error);
        alert('프로그램 초기화에 실패했습니다.');
        return false;
    }
}
