import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- TẢI TEXTURE (LOGO) ---
const textureLoader = new THREE.TextureLoader();

const projectData = {
    "Python": { title: "Dự án Forecasting", desc: "Dự báo doanh thu bằng Python.", logo: "python_logo.png", color: 0x3776AB },
    "SQL": { title: "Tối ưu Database", desc: "Xử lý query tối ưu trên SQL Server.", logo: "sql_logo.png", color: 0xCC2927 },
    "Power BI": { title: "HR Dashboard", desc: "Trực quan hóa dữ liệu nhân sự.", logo: "powerbi_logo.png", color: 0xF2C811 },
    "Excel": { title: "Financial Model", desc: "Tự động hóa báo cáo tài chính.", logo: "excel_logo.png", color: 0x217346 }
};

const skillBoxes = [];

// Hàm tạo khối với logo
Object.keys(projectData).forEach((key, index) => {
    const data = projectData[key];
    
    // Tải ảnh logo
    const texture = textureLoader.load(data.logo);
    
    // Tạo vật liệu: mặt trước có logo, các mặt còn lại màu đặc
    const materials = [
        new THREE.MeshStandardMaterial({ color: data.color }), // phải
        new THREE.MeshStandardMaterial({ color: data.color }), // trái
        new THREE.MeshStandardMaterial({ color: data.color }), // trên
        new THREE.MeshStandardMaterial({ color: data.color }), // dưới
        new THREE.MeshStandardMaterial({ map: texture }),     // trước (có LOGO)
        new THREE.MeshStandardMaterial({ color: data.color })  // sau
    ];

    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const mesh = new THREE.Mesh(geometry, materials);
    
    mesh.position.x = (index - 1.5) * 2.2; // Tự động căn hàng ngang
    mesh.userData = { name: key };
    
    scene.add(mesh);
    skillBoxes.push(mesh);
});

// --- ÁNH SÁNG ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 20);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// --- GRID & CAMERA ---
const grid = new THREE.GridHelper(20, 20, 0x00ffcc, 0x222222);
grid.position.y = -1.5;
scene.add(grid);

camera.position.z = 6;
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- TƯƠNG TÁC CLICK ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(skillBoxes);

    if (intersects.length > 0) {
        const name = intersects[0].object.userData.name;
        const info = projectData[name];
        document.getElementById('project-title').innerText = info.title;
        document.getElementById('project-desc').innerText = info.desc;
        document.getElementById('project-card').classList.remove('hidden');
    }
});

document.getElementById('close-btn').onclick = () => {
    document.getElementById('project-card').classList.add('hidden');
};

// --- RENDER ---
function animate() {
    requestAnimationFrame(animate);
    skillBoxes.forEach((box) => {
        box.rotation.y += 0.005; // Xoay chậm để thấy logo
    });
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});