// Global constants
const canvas = document.getElementById('glCanvas'); // Get the canvas element 
const gl = canvas.getContext('webgl2'); // Get the WebGL2 context

if (!gl) {
    console.error('WebGL 2 is not supported by your browser.');
}

// Set canvas size
canvas.width = 500;
canvas.height = 500;

// Initialize WebGL settings: viewport and clear color
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.1, 0.2, 0.3, 1.0);

// Start rendering
render();

// Render loop
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.SCISSOR_TEST);

    const width = canvas.width/2;
    const height = canvas.height/2;

    gl.viewport(0, 0, width, height);
    gl.scissor(0, 0, width, height);
    gl.clearColor(0, 0, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.viewport(width, 0, width, height);
    gl.scissor(width, 0, width, height);
    gl.clearColor(1, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, height, width, height);
    gl.scissor(0, height, width, height);
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(width, height, width, height);
    gl.scissor(width, height, width, height);
    gl.clearColor(0, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}


// Resize viewport when window size changes
window.addEventListener('resize', () => {
    if(window.innerHeight > window.innerWidth){
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth;
    }
    else{
        canvas.width = window.innerHeight;
        canvas.height = window.innerHeight;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    render();
});
