import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- DỮ LIỆU PROJECT ---
const projectData = {
    "Python": { title: "Dự án Forecasting", desc: "Sử dụng Pandas và Scikit-learn để dự báo doanh thu chuỗi cửa hàng tiện lợi.", link: "#" },
    "SQL": { title: "Tối ưu hóa Database", desc: "Viết các Procedure phức tạp giúp giảm 40% thời gian truy xuất dữ liệu báo cáo.", link: "#" },
    "Power BI": { title: "HR Dashboard", desc: "Trực quan hóa tỷ lệ biến động nhân sự và hiệu suất làm việc theo quý.", link: "#" },
    "Excel": { title: "Financial Model", desc: "Xây dựng mô hình tài chính tự động hóa bằng VBA và Power Query.", link: "#" }
};

// --- TẠO VẬT THỂ ---
const skills = [
    { name: "Python", color: 0x3776AB, x: -2.5 },
    { name: "SQL", color: 0xCC2927, x: -0.8 },
    { name: "Power BI", color: 0xF2C811, x: 0.8 },
    { name: "Excel", color: 0x217346, x: 2.5 }
];

const skillBoxes = [];
skills.forEach(skill => {
    const geometry = new THREE.IcosahedronGeometry(0.7, 0); // Hình khối đa diện nhìn hiện đại hơn
    const material = new THREE.MeshStandardMaterial({ color: skill.color, flatShading: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = skill.x;
    mesh.userData = { name: skill.name }; // Gán ID để nhận diện khi click
    scene.add(mesh);
    skillBoxes.push(mesh);
});

// Ánh sáng & Sàn
scene.add(new THREE.AmbientLight(0xffffff, 1));
const grid = new THREE.GridHelper(20, 20, 0x333333, 0x111111);
grid.position.y = -1.2;
scene.add(grid);

camera.position.z = 6;
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- XỬ LÝ SỰ KIỆN CLICK (RAYCASTER) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // Chuyển đổi tọa độ chuột
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(skillBoxes);

    if (intersects.length > 0) {
        const name = intersects[0].object.userData.name;
        showProject(name);
    }
});

function showProject(name) {
    const data = projectData[name];
    document.getElementById('project-title').innerText = data.title;
    document.getElementById('project-desc').innerText = data.desc;
    document.getElementById('project-card').classList.remove('hidden');
}

document.getElementById('close-btn').onclick = () => {
    document.getElementById('project-card').classList.add('hidden');
};

// --- ANIMATION ---
function animate() {
    requestAnimationFrame(animate);
    skillBoxes.forEach((box, i) => {
        box.rotation.y += 0.01;
        box.position.y = Math.sin(Date.now() * 0.001 + i) * 0.2;
    });
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});