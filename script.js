class GraphDrawer {
    constructor() {
        this.graph = document.getElementById('graph');
        this.isDrawing = false;
        this.currentLine = [];
        this.lines = [];
        this.backgroundImage = null;
        this.isImageLocked = false;
        this.setupGraph();
        this.setupEventListeners();
        this.setupControls();
    }

    setupGraph() {
        const layout = {
            xaxis: {
                range: [-10, 10],
                zeroline: true,
                zerolinecolor: '#000',
                zerolinewidth: 2,
                gridcolor: '#ddd'
            },
            yaxis: {
                range: [-10, 10],
                zeroline: true,
                zerolinecolor: '#000',
                zerolinewidth: 2,
                gridcolor: '#ddd',
                scaleanchor: 'x',
                scaleratio: 1
            },
            dragmode: 'drawopenpath',
            modebar: {
                remove: ['lasso2d', 'select2d'],
                add: ['drawopenpath', 'eraseshape']
            },
            shapes: [],
            images: []
        };

        const config = {
            displayModeBar: true,
            modeBarButtonsToAdd: ['drawopenpath', 'eraseshape'],
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
            scrollZoom: true
        };

        Plotly.newPlot(this.graph, [], layout, config);
    }

    setupEventListeners() {
        this.graph.on('plotly_relayout', (eventdata) => {
            if (eventdata['shapes']) {
                this.lines = eventdata['shapes'].filter(shape => shape.type === 'path');
            }
        });
    }

    setupControls() {
        // Image controls
        document.getElementById('imageInput').addEventListener('change', this.handleImageUpload.bind(this));
        document.getElementById('imageWidth').addEventListener('input', (e) => {
            this.updateImageSize(parseInt(e.target.value), null);
        });
        document.getElementById('imageHeight').addEventListener('input', (e) => {
            this.updateImageSize(null, parseInt(e.target.value));
        });
        document.getElementById('centerX').addEventListener('input', (e) => {
            this.updateImagePosition(parseInt(e.target.value), null);
        });
        document.getElementById('centerY').addEventListener('input', (e) => {
            this.updateImagePosition(null, parseInt(e.target.value));
        });

        // Lock button
        document.getElementById('lockImage').addEventListener('click', () => {
            this.isImageLocked = !this.isImageLocked;
            document.getElementById('lockImage').textContent = 
                this.isImageLocked ? 'Unlock Image' : 'Lock Image';
            this.updateGraphConfig();
        });

        // Points generation
        document.getElementById('generatePoints').addEventListener('click', this.generatePoints.bind(this));

        // Erase all button
        document.getElementById('eraseAll').addEventListener('click', this.eraseAll.bind(this));

        // Opacity slider
        const opacitySlider = document.getElementById('imageOpacity');
        const opacityValue = document.getElementById('imageOpacityValue');
        opacitySlider.addEventListener('input', (e) => {
            opacityValue.textContent = e.target.value;
            this.updateImageOpacity(parseFloat(e.target.value));
        });
    }

    eraseAll() {
        // Clear all shapes
        Plotly.relayout(this.graph, {
            shapes: []
        });
        this.lines = [];
        
        // Clear points list
        document.getElementById('pointsList').value = '';
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.backgroundImage = e.target.result;
                this.addImageToGraph();
            };
            reader.readAsDataURL(file);
        }
    }

    addImageToGraph() {
        if (!this.backgroundImage) return;

        const width = parseInt(document.getElementById('imageWidth').value);
        const height = parseInt(document.getElementById('imageHeight').value);
        const centerX = parseInt(document.getElementById('centerX').value);
        const centerY = parseInt(document.getElementById('centerY').value);
        const opacity = parseFloat(document.getElementById('imageOpacity').value);

        const image = {
            source: this.backgroundImage,
            xref: 'x',
            yref: 'y',
            x: centerX - width/2,
            y: centerY + height/2,
            sizex: width,
            sizey: height,
            sizing: 'stretch',
            layer: 'below',
            opacity: opacity
        };

        Plotly.relayout(this.graph, {
            images: [image]
        });
    }

    updateImageSize(width, height) {
        if (!this.backgroundImage) return;

        const currentWidth = width || parseInt(document.getElementById('imageWidth').value);
        const currentHeight = height || parseInt(document.getElementById('imageHeight').value);
        const centerX = parseInt(document.getElementById('centerX').value);
        const centerY = parseInt(document.getElementById('centerY').value);
        const opacity = parseFloat(document.getElementById('imageOpacity').value);

        const image = {
            source: this.backgroundImage,
            xref: 'x',
            yref: 'y',
            x: centerX - currentWidth/2,
            y: centerY + currentHeight/2,
            sizex: currentWidth,
            sizey: currentHeight,
            sizing: 'stretch',
            layer: 'below',
            opacity: opacity
        };

        Plotly.relayout(this.graph, {
            images: [image]
        });
    }

    updateImagePosition(x, y) {
        if (!this.backgroundImage) return;

        const width = parseInt(document.getElementById('imageWidth').value);
        const height = parseInt(document.getElementById('imageHeight').value);
        const centerX = x || parseInt(document.getElementById('centerX').value);
        const centerY = y || parseInt(document.getElementById('centerY').value);
        const opacity = parseFloat(document.getElementById('imageOpacity').value);

        const image = {
            source: this.backgroundImage,
            xref: 'x',
            yref: 'y',
            x: centerX - width/2,
            y: centerY + height/2,
            sizex: width,
            sizey: height,
            sizing: 'stretch',
            layer: 'below',
            opacity: opacity
        };

        Plotly.relayout(this.graph, {
            images: [image]
        });
    }

    updateImageOpacity(opacity) {
        if (!this.backgroundImage) return;

        const width = parseInt(document.getElementById('imageWidth').value);
        const height = parseInt(document.getElementById('imageHeight').value);
        const centerX = parseInt(document.getElementById('centerX').value);
        const centerY = parseInt(document.getElementById('centerY').value);

        const image = {
            source: this.backgroundImage,
            xref: 'x',
            yref: 'y',
            x: centerX - width/2,
            y: centerY + height/2,
            sizex: width,
            sizey: height,
            sizing: 'stretch',
            layer: 'below',
            opacity: opacity
        };

        Plotly.relayout(this.graph, {
            images: [image]
        });
    }

    updateGraphConfig() {
        Plotly.relayout(this.graph, {
            dragmode: this.isImageLocked ? 'pan' : 'drawopenpath'
        });
    }

    generatePoints() {
        const numPoints = parseInt(document.getElementById('numPoints').value);
        const pointsList = document.getElementById('pointsList');
        
        if (this.lines.length === 0) {
            pointsList.value = "No line drawn yet";
            return;
        }

        const line = this.lines[0];
        const points = this.generateEquallySpacedPoints(line, numPoints);
        
        // Format and display points
        const formattedPoints = points.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join('\n');
        pointsList.value = formattedPoints;
    }

    generateEquallySpacedPoints(line, numPoints) {
        if (!line || !line.path) return [];

        // Parse the SVG path into points
        const path = line.path.split(/[ML]/).filter(Boolean).map(point => {
            const [x, y] = point.split(',').map(Number);
            return { x, y };
        });

        if (path.length < 2) return [];

        const points = [];
        const totalLength = this.calculateLineLength(path);
        const segmentLength = totalLength / (numPoints - 1);

        for (let i = 0; i < numPoints; i++) {
            const distance = i * segmentLength;
            points.push(this.getPointAtDistance(path, distance));
        }

        return points;
    }

    calculateLineLength(path) {
        let length = 0;
        for (let i = 1; i < path.length; i++) {
            const dx = path[i].x - path[i - 1].x;
            const dy = path[i].y - path[i - 1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }

    getPointAtDistance(path, distance) {
        let currentDistance = 0;
        
        for (let i = 1; i < path.length; i++) {
            const dx = path[i].x - path[i - 1].x;
            const dy = path[i].y - path[i - 1].y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);
            
            if (currentDistance + segmentLength >= distance) {
                const ratio = (distance - currentDistance) / segmentLength;
                return {
                    x: path[i - 1].x + dx * ratio,
                    y: path[i - 1].y + dy * ratio
                };
            }
            
            currentDistance += segmentLength;
        }
        
        return path[path.length - 1];
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GraphDrawer();
}); 