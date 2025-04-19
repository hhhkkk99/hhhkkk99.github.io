/*-----------------------------------------------------------------------------
class regularOctahedron
-----------------------------------------------------------------------------*/

export class regularOctahedron {
    constructor(gl, options = {}) {
        this.gl = gl;
        
        // Creating VAO and buffers
        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        this.ebo = gl.createBuffer();

        const h = Math.sqrt(2)/2;
        const l = 0.5;
        
        // Initializing vertex data - 24 vertices (3 coordinates each)
        this.vertices = new Float32Array([
            // Up front face (v0,v1,v2) 
            0, h, 0,  -l, 0, -l,  l, 0, -l, 
            
            // Up right face (v0,v2,v3) 
            0, h, 0,  l, 0, -l,   l, 0, l,
            
            // Up back face (v0,v3,v4)
            0, h, 0,  l, 0, l,  -l, 0, l, 
            
            // Up left face (v0,v4,v1) 
            0, h, 0,  -l, 0, l,  -l, 0, -l,

            // Bottom front face (v5, v1, v2)
            0, -h, 0,  -l, 0, -l,  l, 0, -l,  
             
            // Bottom right face (v5, v2, v3)
            0, -h, 0,  l, 0, -l,   l, 0, l,

            // Bottom back face (v5, v3, v4)
            0, -h, 0,  l, 0, l,  -l, 0, l,

            // Bottom left face (v5, v4, v1)
            0, -h, 0,  -l, 0, l,  -l, 0, -l
            
        ]);

        // Calculate normals for each face
        // For each triangular face, compute cross product of two edges
        
        // Up Front face normal
        const upFrontNormal = this.calculateNormal(
            [0, h, 0], 
            [-l, 0, -l], 
            [l, 0, -l]
        );
        
        // Up Right face normal
        const upRightNormal = this.calculateNormal(
            [0, h, 0], 
            [l, 0, -l], 
            [l, 0, l]
        );
        
        // Up Back face normal
        const upBackNormal = this.calculateNormal(
            [0, h, 0], 
            [l, 0, l], 
            [-l, 0, l]
        );
        
        // Up Left face normal
        const upLeftNormal = this.calculateNormal(
            [0, h, 0], 
            [-l, 0, l], 
            [-l, 0, -l]
        );

        // Down Front face normal
        const downFrontNormal = this.calculateNormal(
            [0, -h, 0],         
            [-l, 0, -l], 
            [l, 0, -l]
        );
        
        // Down Right face normal
        const downRightNormal = this.calculateNormal(
            [0, -h, 0], 
            [l, 0, -l], 
            [l, 0, l]
        );
        
        // Down Back face normal
        const downBackNormal = this.calculateNormal(
            [0, -h, 0], 
            [l, 0, l], 
            [-l, 0, l]
        );
        
        // Down Left face normal
        const downLeftNormal = this.calculateNormal(
            [0, -h, 0], 
            [-l, 0, l], 
            [-l, 0, -l]
        );
        


        // Normals for all vertices - repeat the normal for each vertex in a face
        this.normals = new Float32Array([
            // Up Front face
            ...upFrontNormal, ...upFrontNormal, ...upFrontNormal,
            
            // Up Right face 
            ...upRightNormal, ...upRightNormal, ...upRightNormal,
            
            // Up Back face 
            ...upBackNormal, ...upBackNormal, ...upBackNormal,
            
            // Up Left face 
            ...upLeftNormal, ...upLeftNormal, ...upLeftNormal,

            // Down Front face
            ...downFrontNormal, ...downFrontNormal, ...downFrontNormal,

            // Down Right face
            ...downRightNormal, ...downRightNormal, ...downRightNormal,

            // Down Back face
            ...downBackNormal, ...downBackNormal, ...downBackNormal,

            // Down Left face
            ...downLeftNormal, ...downLeftNormal, ...downLeftNormal
            

        ]);

        // Colors for each face
        if (options.color) {
            this.colors = new Float32Array(24 * 4); 
            for (let i = 0; i < 24; i++) {
                this.colors[i*4] = options.color[0];
                this.colors[i*4+1] = options.color[1];
                this.colors[i*4+2] = options.color[2];
                this.colors[i*4+3] = options.color[3];
            }
        } else {
            this.colors = new Float32Array([
                // Front face (red) - 3 vertices
                1, 0, 0, 1,  1, 0, 0, 1,  1, 0, 0, 1,
                
                // Right face (yellow) - 3 vertices
                1, 1, 0, 1,  1, 1, 0, 1,  1, 1, 0, 1,
                
                // Back face (magenta) - 3 vertices
                1, 0, 1, 1,  1, 0, 1, 1,  1, 0, 1, 1,
                
                // Left face (cyan) - 3 vertices
                0, 1, 1, 1,  0, 1, 1, 1,  0, 1, 1, 1,
                                
                // Front face (red) - 3 vertices
                1, 0, 0, 1,  1, 0, 0, 1,  1, 0, 0, 1,
                
                // Right face (yellow) - 3 vertices
                1, 1, 0, 1,  1, 1, 0, 1,  1, 1, 0, 1,
                
                // Back face (magenta) - 3 vertices
                1, 0, 1, 1,  1, 0, 1, 1,  1, 0, 1, 1,
                
                // Left face (cyan) - 3 vertices
                0, 1, 1, 1,  0, 1, 1, 1,  0, 1, 1, 1,
                
            ]);
        }

        // Texture coordinates
        this.texCoords = new Float32Array([
            // Up front face 
            0.5, 1, 0.5, 0.5, 0.75, 0.5,
            
            // Up right face
            0.5, 1, 0.75, 0.5, 1, 0.5,

            // Up back face
            0.5, 1, 0, 0.5, 0.25, 0.5,
            
            // Up left face
            0.5, 1, 0.25, 0.5, 0.5, 0.5,

            // Bottom front face
            0.5, 0, 0.5, 0.5, 0.75, 0.5,
             
            // Bottom right face 
            0.5, 0, 0.75, 0.5, 1, 0.5,

            // Bottom back face
            0.5, 0, 0, 0.5, 0.25, 0.5,

            // Bottom left face 
            0.5, 0, 0.25, 0.5, 0.5, 0.5
        ]);

        // Indices for drawing - 24 indices
        this.indices = new Uint16Array([
            // Up front face 
            0, 1, 2,
            
            // Up right face
            3, 4, 5,

            // Up back face
            6, 7, 8, 
            
            // Up left face
            9, 10, 11,

            // Bottom front face
            12, 13, 14,
             
            // Bottom right face 
            15, 16, 17, 

            // Bottom back face
            18, 19, 20,

            // Bottom left face
            21, 22, 23            

        ]);

        this.initBuffers();
    }

    // Calculate normal vector for a triangle (cross product of two edges)
    calculateNormal(v0, v1, v2) {
        // Vector from v0 to v1
        const edge1 = [
            v1[0] - v0[0],
            v1[1] - v0[1],
            v1[2] - v0[2]
        ];
        
        // Vector from v0 to v2
        const edge2 = [
            v2[0] - v0[0],
            v2[1] - v0[1],
            v2[2] - v0[2]
        ];
        
        // Cross product edge1 × edge2
        const normal = [
            edge1[1] * edge2[2] - edge1[2] * edge2[1],
            edge1[2] * edge2[0] - edge1[0] * edge2[2],
            edge1[0] * edge2[1] - edge1[1] * edge2[0]
        ];
        
        // Normalize the vector
        const length = Math.sqrt(
            normal[0] * normal[0] + 
            normal[1] * normal[1] + 
            normal[2] * normal[2]
        );
        
        if (length > 0) {
            normal[0] /= length;
            normal[1] /= length;
            normal[2] /= length;
        }
        
        return normal;
    }

    initBuffers() {
        const gl = this.gl;

        // Calculate buffer sizes
        const vSize = this.vertices.byteLength;
        const nSize = this.normals.byteLength;
        const cSize = this.colors.byteLength;
        const tSize = this.texCoords.byteLength;
        const totalSize = vSize + nSize + cSize + tSize;

        gl.bindVertexArray(this.vao);

        // Copy data to VBO
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, totalSize, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize, this.normals);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize + nSize, this.colors);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize + nSize + cSize, this.texCoords);

        // Copy index data to EBO
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        // Set up vertex attributes
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);  // position
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, vSize);  // normal
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, vSize + nSize);  // color
        gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 0, vSize + nSize + cSize);  // texCoord

        // Enable vertex attribute arrays
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.enableVertexAttribArray(2);
        gl.enableVertexAttribArray(3);

        // Unbind buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    draw(shader) {
        const gl = this.gl;
        shader.use();
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    delete() {
        const gl = this.gl;
        gl.deleteBuffer(this.vbo);
        gl.deleteBuffer(this.ebo);
        gl.deleteVertexArray(this.vao);
    }
}