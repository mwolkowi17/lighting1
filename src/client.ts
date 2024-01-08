import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const hemisphere = new THREE.HemisphereLight(0xfeeb1,0x08020, 20)
scene.add(hemisphere)

const spot1 = new THREE.SpotLight(0xffa95c,40)
spot1.castShadow = true
spot1.shadow.bias = -0.0001
spot1.shadow.mapSize.width = 1024*4
spot1.shadow.mapSize.height= 1024*4

scene.add(spot1)

const renderer = new THREE.WebGLRenderer()
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 2.3
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new GLTFLoader().load('./sprzeglo_klowe_for_app.glb', (gltf) => {
    const root = gltf.scene;
    root.scale.x=.5
    root.scale.y=.5
    root.scale.z=.5
    
    root.traverse(n=>{  
        n.castShadow=true
        n.receiveShadow=true
    })

    scene.add(root); //co zrobic z tym?)
}
)

const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
//scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    //cube.rotation.x += 0.01
    //cube.rotation.y += 0.01
    spot1.position.set(
        camera.position.x+10,
        camera.position.y+10,
        camera.position.z+10,
    )

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()