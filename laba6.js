let markerVisible = { A: false, B: false, C: false, D: false, F: false };

AFRAME.registerComponent('registerevents', {
  init: function () {
    var marker = this.el;
    marker.addEventListener('markerFound', function () {
      console.log('markerFound', marker.id);
      markerVisible[marker.id] = true;
    });
    marker.addEventListener('markerLost', function () {
      console.log('markerLost', marker.id);
      markerVisible[marker.id] = false;
    });
  }
});

AFRAME.registerComponent('run', {
  init: function () {
    this.markers = {
      A: document.querySelector("#A"),
      B: document.querySelector("#B"),
      C: document.querySelector("#C"),
      D: document.querySelector("#D"),
      F: document.querySelector("#F")
    };

    this.lines = {
      AB: {
        cylinder: this.createCylinder('#lineAB'),
        markerStart: 'A',
        markerEnd: 'B'
      },
      BC: {
        cylinder: this.createCylinder('#lineBC'),
        markerStart: 'B',
        markerEnd: 'C'
      },
      CD: {
        cylinder: this.createCylinder('#lineCD'),
        markerStart: 'C',
        markerEnd: 'D'
      },
      DF: {
        cylinder: this.createCylinder('#lineDF'),
        markerStart: 'D',
        markerEnd: 'F'
      },
      FA: {
        cylinder: this.createCylinder('#lineFA'),
        markerStart: 'F',
        markerEnd: 'A'
      }
    };
  },

  createCylinder: function (selector) {
    let material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    let geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 12);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(90)));

    let cylinder = new THREE.Mesh(geometry, material);
    let line = document.querySelector(selector).object3D;
    line.add(cylinder);
    cylinder.visible = false;

    return cylinder;
  },

  updateCylinder: function (line, markerStart, markerEnd) {
    let start = this.markers[markerStart].object3D.getWorldPosition(new THREE.Vector3());
    let end = this.markers[markerEnd].object3D.getWorldPosition(new THREE.Vector3());
    let distance = start.distanceTo(end);

    line.lookAt(end);
    line.scale.set(1, 1, distance);
    line.visible = true;
  },

  hideCylinder: function (line) {
    line.visible = false;
  },

  tick: function () {
    for (let line of Object.values(this.lines)) {
      let { markerStart, markerEnd, cylinder } = line;

      if (markerVisible[markerStart] && markerVisible[markerEnd]) {
        this.updateCylinder(cylinder, markerStart, markerEnd);
      } else {
        this.hideCylinder(cylinder);
      }
    }
  }
});
