import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- CẤU HÌNH CHUNG ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --- DỮ LIỆU ---
const projectData = {
    "Python": { color: 0x3776AB, logo: "python_logo.png", title: "Dự án Forecasting", desc: "Dự báo doanh thu bằng Pandas & ML." },
    "SQL": { color: 0xCC2927, logo: "sql_logo.png", title: "Tối ưu Database", desc: "Xử lý Query dữ liệu lớn trên SQL Server." },
    "Power BI": { color: 0xF2C811, logo: "powerbi_logo.png", title: "HR Dashboard", desc: "Báo cáo trực quan hiệu suất nhân sự." },
    "Excel": { color: 0x217346, logo: "exel_logo.png", title: "Financial Model", desc: "Tự động hóa báo cáo tài chính bằng VBA." }
};

const textureLoader = new THREE.TextureLoader();
const skillBoxes = [];

// --- TẠO CÁC KHỐI LOGO GIỐNG ẢNH ---
Object.keys(projectData).forEach((key, index) => {
    const data = projectData[key];
    const texture = textureLoader.load(data.logo);

    // Dán texture lên tất cả 6 mặt
    const material = new THREE.MeshStandardMaterial({ 
        map: texture, 
        transparent: false,
        roughness: 0.3,
        metalness: 0.5
    });

    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const mesh = new THREE.Mesh(geometry, material);
    
    // Vị trí các khối
    mesh.position.x = (index - 1.5) * 2.5;
    mesh.userData = { name: key };
    
    // Thêm ánh sáng điểm (PointLight) ngay tại khối để tạo hiệu ứng phát sáng như ảnh
    const light = new THREE.PointLight(data.color, 10, 5);
    mesh.add(light); // Ánh sáng đi theo khối

    scene.add(mesh);
    skillBoxes.push(mesh);
});

// --- HIỆU ỨNG HẠT (PARTICLES) ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0x00ffcc });
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- ÁNH SÁNG MÔI TRƯỜNG ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// --- SÀN LƯỚI (GRID) ---
const grid = new THREE.GridHelper(30, 30, 0x00ffcc, 0x111111);
grid.position.y = -2;
scene.add(grid);

camera.position.z = 7;
camera.position.y = 1;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- TƯƠNG TÁC ---
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

// --- VÒNG LẶP ANIMATION ---
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;

    skillBoxes.forEach((box, i) => {
        // Xoay nhẹ nhàng
        box.rotation.y += 0.01;
        box.rotation.x += 0.005;
        
        // Hiệu ứng bay bổng (Floating)
        box.position.y = Math.sin(time + i) * 0.3;
    });

    // Các hạt chuyển động nhẹ
    particlesMesh.rotation.y += 0.001;

    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});