/* THREE приходит из three-d-stage (он грузит three по importmap) — без npm-импорта. */
const THREE = (typeof window !== 'undefined' && window.__WORKSHOP_THREE__) || null;

/* Мастерская папы — Room 2 (основная рабочая комната).
   Оболочка новая: светлые стены, высокий потолок, большие окна.
   Станки, инструмент и личные маркеры — по фотобазе реальной мастерской. */

const M = {
  plaster:  new THREE.MeshStandardMaterial({ name: 'plaster',      color: 0xf7f6f3, roughness: 0.95 }),
  floor:    new THREE.MeshStandardMaterial({ name: 'floor_oak',    color: 0xd8c4a3, roughness: 0.7 }),
  oak:      new THREE.MeshStandardMaterial({ name: 'light_oak',    color: 0xe2caa2, roughness: 0.6 }),
  oakDark:  new THREE.MeshStandardMaterial({ name: 'warm_oak',     color: 0xa9814f, roughness: 0.65 }),
  greyWood: new THREE.MeshStandardMaterial({ name: 'grey_wood',    color: 0x928d86, roughness: 0.78 }),
  steel:    new THREE.MeshStandardMaterial({ name: 'steel',        color: 0xc6c9cd, roughness: 0.32, metalness: 0.35 }),
  iron:     new THREE.MeshStandardMaterial({ name: 'cast_iron',    color: 0x464a50, roughness: 0.5, metalness: 0.3 }),
  brass:    new THREE.MeshStandardMaterial({ name: 'brass',        color: 0xb68235, roughness: 0.33, metalness: 0.38 }),
  fabric:   new THREE.MeshStandardMaterial({ name: 'fabric_black', color: 0x2b2b2e, roughness: 0.92 }),
  glass:    new THREE.MeshStandardMaterial({ name: 'window_glass', color: 0xe6eff4, roughness: 0.08, metalness: 0.04, transparent: true, opacity: 0.22 }),
  leaf:     new THREE.MeshStandardMaterial({ name: 'foliage',      color: 0x53704a, roughness: 0.85 }),
  terracot: new THREE.MeshStandardMaterial({ name: 'terracotta',   color: 0xa8674a, roughness: 0.88 }),
  yellow:   new THREE.MeshStandardMaterial({ name: 'tool_yellow',  color: 0xd6a423, roughness: 0.45 }),
  canvasArt:new THREE.MeshStandardMaterial({ name: 'canvas_paint', color: 0x715f47, roughness: 0.9 }),
  paper:    new THREE.MeshStandardMaterial({ name: 'paper',        color: 0xf6f2e8, roughness: 0.95 }),
  red:      new THREE.MeshStandardMaterial({ name: 'signal_red',   color: 0x933122, roughness: 0.55 }),
  pink:     new THREE.MeshStandardMaterial({ name: 'sofa_rose',    color: 0xc98a92, roughness: 0.92 }),
  stone:    new THREE.MeshStandardMaterial({ name: 'cast_stone',   color: 0xcfc9be, roughness: 0.9 }),
};

function box(name, w, h, d, mat, x, y, z, ry = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.name = name; m.position.set(x, y, z); m.rotation.y = ry;
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
function cyl(name, rt, rb, h, mat, x, y, z, rot = [0, 0, 0], seg = 32) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.name = name; m.position.set(x, y, z); m.rotation.set(rot[0], rot[1], rot[2]);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
function torus(name, r, tube, mat, x, y, z, rot = [0, 0, 0], arc = Math.PI * 2) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 14, 40, arc), mat);
  m.name = name; m.position.set(x, y, z); m.rotation.set(rot[0], rot[1], rot[2]);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
function g(name, ...kids) { const o = new THREE.Group(); o.name = name; kids.forEach(k => o.add(k)); return o; }

const W = 6.6, D = 5.4, H = 3.8;
const hw = W / 2, hd = D / 2;

/* ─────────────── shell: three walls, cut ceiling, windows ─────────────── */
function shell() {
  const s = g('room_shell');

  const floor = box('floor', W, 0.1, D, M.floor, 0, -0.05, 0);
  floor.castShadow = false;
  s.add(floor);
  for (let i = 0; i < 9; i++) {
    const seam = box('floor_seam_' + i, W, 0.004, 0.012, M.oakDark, 0, 0.002, -hd + 0.3 + i * 0.6);
    seam.castShadow = false; s.add(seam);
  }

  s.add(box('wall_back', W + 0.24, H, 0.12, M.plaster, 0, H / 2, -hd - 0.06));
  s.add(box('wall_left_a', 0.12, H, 4.55, M.plaster, -hw - 0.06, H / 2, -0.425));
  s.add(box('wall_left_header', 0.12, H - 2.3, 0.85, M.plaster, -hw - 0.06, 2.3 + (H - 2.3) / 2, 2.275));
  s.add(box('door1_jamb_a', 0.16, 2.3, 0.06, M.oak, -hw - 0.02, 1.15, 1.88));
  s.add(box('door1_lintel', 0.16, 0.08, 0.92, M.oak, -hw - 0.02, 2.34, 2.275));
  s.add(box('threshold_room1', 0.2, 0.05, 0.88, M.oak, -hw - 0.06, 0.02, 2.275));
  s.add(box('door_leaf_entry', 0.05, 2.24, 0.84, M.oakDark, -hw - 0.03, 1.14, 2.275));
  for (let i = 0; i < 2; i++) s.add(box('door_panel_entry_' + i, 0.012, 0.84, 0.58, M.oak, -hw - 0.005, 0.68 + i * 0.96, 2.275));
  s.add(cyl('door_handle_entry', 0.016, 0.016, 0.13, M.brass, -hw + 0.02, 1.06, 1.98, [0, 0, Math.PI / 2], 12));
  // right wall in segments — a doorway leads on to the storage room
  s.add(box('wall_right_a', 0.12, H, 2.55, M.plaster, hw + 0.06, H / 2, -hd + 1.275));
  s.add(box('wall_right_b', 0.12, H, 1.55, M.plaster, hw + 0.06, H / 2, hd - 0.775));
  s.add(box('wall_right_header', 0.12, 1.55, 1.3, M.plaster, hw + 0.06, H - 0.775, 0.625));
  s.add(box('door_jamb_a', 0.16, 2.25, 0.06, M.oak, hw + 0.02, 1.125, -0.02));
  s.add(box('door_jamb_b', 0.16, 2.25, 0.06, M.oak, hw + 0.02, 1.125, 1.27));
  s.add(box('door_lintel', 0.16, 0.08, 1.36, M.oak, hw + 0.02, 2.29, 0.625));
  s.add(box('threshold_room3', 0.2, 0.05, 1.3, M.oak, hw + 0.06, 0.02, 0.625));
  s.add(box('door_leaf_storage', 0.05, 2.2, 1.24, M.oakDark, hw + 0.03, 1.12, 0.625));
  for (let i = 0; i < 2; i++) s.add(box('door_panel_storage_' + i, 0.012, 0.82, 0.9, M.oak, hw + 0.005, 0.66 + i * 0.94, 0.625));
  s.add(cyl('door_handle_storage', 0.016, 0.016, 0.13, M.brass, hw - 0.02, 1.06, 0.1, [0, 0, Math.PI / 2], 12));

  s.add(box('skirting_back', W, 0.13, 0.03, M.oak, 0, 0.065, -hd + 0.015));
  s.add(box('skirting_left', 0.03, 0.13, 4.55, M.oak, -hw + 0.015, 0.065, -0.425));
  s.add(box('skirting_right_a', 0.03, 0.13, 2.55, M.oak, hw - 0.015, 0.065, -hd + 1.275));
  s.add(box('skirting_right_b', 0.03, 0.13, 1.55, M.oak, hw - 0.015, 0.065, hd - 0.775));

  // ceiling: a band along the back wall, the rest cut away to open beams
  s.add(box('ceiling_band', W, 0.1, 1.5, M.plaster, 0, H - 0.05, -hd + 0.75));
  for (let i = 0; i < 5; i++) s.add(box('ceiling_beam_' + i, W, 0.2, 0.15, M.oak, 0, H - 0.15, -hd + 1.7 + i * 0.9));
  for (let i = 0; i < 3; i++) s.add(box('ceiling_purlin_' + i, 0.12, 0.1, 4.0, M.oak, -2.0 + i * 2.0, H - 0.3, hd - 2.0));

  // tall windows in the left wall
  [-1.35, 0.95].forEach((z, i) => {
    const x = -hw - 0.06;
    const win = g('window_left_' + i);
    win.add(box('window_glass_' + i, 0.03, 2.05, 1.55, M.glass, x + 0.03, 1.95, z));
    win.add(box('window_head_' + i, 0.18, 0.1, 1.72, M.oak, x, 3.05, z));
    win.add(box('window_sill_' + i, 0.26, 0.1, 1.72, M.oak, x + 0.06, 0.85, z));
    win.add(box('window_reveal_a_' + i, 0.18, 2.2, 0.1, M.oak, x, 1.95, z - 0.81));
    win.add(box('window_reveal_b_' + i, 0.18, 2.2, 0.1, M.oak, x, 1.95, z + 0.81));
    win.add(box('window_mullion_' + i, 0.1, 2.05, 0.055, M.oak, x + 0.02, 1.95, z));
    win.add(box('window_transom_a_' + i, 0.1, 0.05, 1.55, M.oak, x + 0.02, 2.5, z));
    win.add(box('window_transom_b_' + i, 0.1, 0.05, 1.55, M.oak, x + 0.02, 1.4, z));
    s.add(win);
  });
  // a smaller window over the packing corner
  {
    const x = hw + 0.06, z = hd - 0.8;
    s.add(box('window_right_glass', 0.03, 1.15, 1.15, M.glass, x - 0.03, 2.2, z));
    s.add(box('window_right_head', 0.18, 0.1, 1.32, M.oak, x, 2.83, z));
    s.add(box('window_right_sill', 0.24, 0.1, 1.32, M.oak, x - 0.05, 1.57, z));
    s.add(box('window_right_rev_a', 0.18, 1.3, 0.1, M.oak, x, 2.2, z - 0.61));
    s.add(box('window_right_rev_b', 0.18, 1.3, 0.1, M.oak, x, 2.2, z + 0.61));
    s.add(box('window_right_mullion', 0.1, 1.15, 0.05, M.oak, x - 0.02, 2.2, z));
  }

  // tidy surface conduit and sockets — the old open wiring, done properly
  s.add(box('conduit_back', W - 0.4, 0.05, 0.05, M.plaster, 0, 1.28, -hd + 0.03));
  for (let i = 0; i < 4; i++) {
    s.add(box('socket_' + i, 0.16, 0.11, 0.04, M.paper, -2.4 + i * 1.5, 1.12, -hd + 0.02));
    s.add(cyl('conduit_drop_' + i, 0.022, 0.022, 0.16, M.plaster, -2.4 + i * 1.5, 1.2, -hd + 0.03, [0, 0, 0], 10));
  }
  // fire extinguisher, mounted
  s.add(cyl('extinguisher_body', 0.075, 0.075, 0.42, M.red, hw - 0.16, 1.1, -hd + 0.35, [0, 0, 0], 24));
  s.add(cyl('extinguisher_neck', 0.03, 0.03, 0.08, M.iron, hw - 0.16, 1.35, -hd + 0.35, [0, 0, 0], 14));
  s.add(box('extinguisher_bracket', 0.1, 0.12, 0.12, M.iron, hw - 0.05, 1.15, -hd + 0.35));
  return s;
}

/* ─────────────── back wall: saw wall, precision tools, sign, painting ─────────────── */
function toolWall() {
  const s = g('tool_wall');
  const z = -hd + 0.02;
  s.add(box('tool_board', 3.4, 1.6, 0.045, M.oak, -1.6, 2.15, z));
  for (let i = 0; i < 16; i++) {
    s.add(cyl('board_hook_' + i, 0.008, 0.008, 0.06, M.brass, -3.0 + i * 0.19, 1.56, z + 0.05, [Math.PI / 2, 0, 0], 8));
  }

  // hand saws, largest to smallest: tapered blade, toothed edge, wooden handle
  [[-3.12, 0.86, 0.3, 0.14], [-2.2, 0.72, 0.26, 0.12], [-1.42, 0.6, 0.22, 0.1], [-0.78, 0.46, 0.18, 0.09]]
    .forEach(([x, len, hHandle, hTip], i) => {
      const y = 2.62 - i * 0.02;
      const sh = new THREE.Shape();
      sh.moveTo(0, 0); sh.lineTo(len, 0); sh.lineTo(len, -hHandle); sh.lineTo(0, -hTip); sh.closePath();
      const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.006, bevelEnabled: false }), M.steel);
      blade.name = 'saw_blade_' + i;
      blade.position.set(x, y, z + 0.042);
      blade.castShadow = true; blade.receiveShadow = true;
      s.add(blade);
      s.add(box('saw_spine_' + i, len, 0.022, 0.014, M.iron, x + len / 2, y - 0.008, z + 0.05));
      const teeth = box('saw_teeth_' + i, len, 0.018, 0.01, M.iron, x + len / 2, y - (hHandle + hTip) / 2 + 0.01, z + 0.05);
      teeth.rotation.z = Math.atan2(hTip - hHandle, len);
      s.add(teeth);
      s.add(box('saw_handle_' + i, 0.15, hHandle + 0.06, 0.04, M.oakDark, x + len + 0.07, y - hHandle / 2, z + 0.045));
      s.add(torus('saw_handle_eye_' + i, 0.045, 0.013, M.oakDark, x + len + 0.08, y - hHandle / 2, z + 0.045));
      s.add(cyl('saw_peg_' + i, 0.008, 0.008, 0.06, M.brass, x + len * 0.55, y + 0.03, z + 0.05, [Math.PI / 2, 0, 0], 8));
    });
  // squares and a coping saw
  s.add(box('try_square_blade', 0.03, 0.34, 0.012, M.steel, -0.35, 2.55, z + 0.045));
  s.add(box('try_square_stock', 0.2, 0.035, 0.03, M.oakDark, -0.44, 2.72, z + 0.045));

  // precision hand tools in a row
  for (let i = 0; i < 9; i++) {
    const x = -2.95 + i * 0.17;
    s.add(cyl('screwdriver_shaft_' + i, 0.007, 0.007, 0.19, M.steel, x, 1.78, z + 0.045, [Math.PI / 2, 0, 0], 8));
    s.add(cyl('screwdriver_grip_' + i, 0.017, 0.013, 0.1, i % 3 === 0 ? M.brass : M.iron, x, 1.66, z + 0.045, [Math.PI / 2, 0, 0], 12));
  }
  for (let i = 0; i < 4; i++) {
    s.add(cyl('scriber_' + i, 0.005, 0.005, 0.22, M.steel, -1.35 + i * 0.13, 1.75, z + 0.045, [Math.PI / 2, 0, 0], 8));
    s.add(cyl('scriber_grip_' + i, 0.014, 0.011, 0.07, M.oakDark, -1.35 + i * 0.13, 1.64, z + 0.045, [Math.PI / 2, 0, 0], 10));
  }
  // long levels and rules
  s.add(box('spirit_level_long', 1.5, 0.065, 0.03, M.steel, -0.9, 2.0, z + 0.045));
  s.add(box('level_vial', 0.11, 0.035, 0.02, M.brass, -0.9, 2.0, z + 0.062));
  s.add(box('spirit_level_short', 0.8, 0.055, 0.028, M.yellow, -1.25, 1.88, z + 0.045));
  s.add(box('steel_rule', 1.15, 0.035, 0.02, M.steel, -1.05, 1.5, z + 0.045));
  // wrenches, biggest to smallest
  for (let i = 0; i < 6; i++) {
    const l = 0.3 - i * 0.03;
    s.add(box('wrench_' + i, 0.028, l, 0.01, M.steel, -0.62 + i * 0.075, 1.95 - (0.3 - l) / 2, z + 0.045));
    s.add(box('wrench_head_' + i, 0.05, 0.055, 0.012, M.steel, -0.62 + i * 0.075, 1.95 + l / 2, z + 0.045));
  }
  // clamps on the board
  for (let i = 0; i < 4; i++) {
    s.add(box('clamp_bar_' + i, 0.028, 0.36, 0.022, M.steel, -2.9 + i * 0.15, 1.35, z + 0.05));
    s.add(box('clamp_jaw_' + i, 0.05, 0.05, 0.075, M.iron, -2.9 + i * 0.15, 1.19, z + 0.05));
    s.add(cyl('clamp_screw_' + i, 0.01, 0.01, 0.09, M.steel, -2.9 + i * 0.15, 1.15, z + 0.05, [0, 0, 0], 8));
  }

  /* the round wall sign — the workshop's own mark */
  const sign = g('round_wall_sign');
  const sx = 0.75, sy = 2.45, sz = z + 0.06;
  sign.add(torus('sign_ring_outer', 0.44, 0.03, M.brass, sx, sy, sz));
  sign.add(torus('sign_ring_inner', 0.31, 0.014, M.brass, sx, sy, sz));
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const t = box('sign_tooth_' + i, 0.05, 0.011, 0.028, M.brass, sx + Math.cos(a) * 0.375, sy + Math.sin(a) * 0.375, sz);
    t.rotation.z = a;
    sign.add(t);
  }
  sign.add(cyl('sign_hub', 0.07, 0.07, 0.035, M.brass, sx, sy, sz - 0.005, [Math.PI / 2, 0, 0], 28));
  [0.6, -0.6].forEach((a, i) => {
    const bl = box('shear_blade_' + i, 0.52, 0.027, 0.013, M.steel, sx + Math.cos(a) * 0.17, sy + Math.sin(a) * 0.17, sz + 0.03);
    bl.rotation.z = a; sign.add(bl);
    const tip = box('shear_tip_' + i, 0.1, 0.014, 0.012, M.steel, sx + Math.cos(a) * 0.44, sy + Math.sin(a) * 0.44, sz + 0.03);
    tip.rotation.z = a; sign.add(tip);
    sign.add(torus('shear_bow_' + i, 0.065, 0.012, M.steel, sx - Math.cos(a) * 0.31, sy - Math.sin(a) * 0.31, sz + 0.03));
  });
  s.add(sign);

  /* the painting — the same still life, in its wooden frame */
  s.add(box('painting_frame', 0.7, 0.88, 0.055, M.oakDark, 2.4, 2.25, z + 0.025));
  s.add(box('painting_lip', 0.6, 0.78, 0.012, M.brass, 2.4, 2.25, z + 0.05));
  s.add(box('painting_canvas', 0.56, 0.74, 0.02, M.canvasArt, 2.4, 2.25, z + 0.055));
  s.add(box('painting_still_life_a', 0.2, 0.26, 0.02, M.terracot, 2.33, 2.18, z + 0.066));
  s.add(box('painting_still_life_b', 0.13, 0.16, 0.02, M.oak, 2.5, 2.1, z + 0.066));
  s.add(box('painting_still_life_c', 0.28, 0.05, 0.02, M.oakDark, 2.4, 1.96, z + 0.066));
  return s;
}

/* ─────────────── workbench with the vise ─────────────── */
function workbench() {
  const s = g('workbench');
  const x0 = -1.65, z0 = -hd + 0.48, top = 0.93;
  s.add(box('bench_top', 2.95, 0.1, 0.8, M.oakDark, x0, top, z0));
  s.add(box('bench_top_lip', 2.95, 0.03, 0.06, M.oak, x0, top + 0.065, z0 + 0.37));
  s.add(box('bench_apron', 2.85, 0.14, 0.04, M.oakDark, x0, top - 0.14, z0 + 0.38));
  [[-1.38, -0.33], [-1.38, 0.33], [1.38, -0.33], [1.38, 0.33]].forEach(([dx, dz], i) =>
    s.add(box('bench_leg_' + i, 0.11, top - 0.1, 0.11, M.oakDark, x0 + dx, (top - 0.1) / 2, z0 + dz)));
  s.add(box('bench_stretcher', 2.7, 0.08, 0.06, M.oakDark, x0, 0.22, z0));
  for (let i = 0; i < 4; i++) {
    s.add(box('bench_drawer_' + i, 0.64, 0.185, 0.62, M.oak, x0 + 1.0, 0.74 - i * 0.2, z0));
    s.add(cyl('drawer_pull_' + i, 0.013, 0.013, 0.18, M.brass, x0 + 1.0, 0.74 - i * 0.2, z0 + 0.33, [0, 0, Math.PI / 2], 12));
    s.add(box('drawer_label_' + i, 0.14, 0.05, 0.006, M.paper, x0 + 0.7, 0.74 - i * 0.2, z0 + 0.32));
  }
  s.add(box('bench_shelf', 1.5, 0.05, 0.64, M.oak, x0 - 0.7, 0.34, z0));
  // dog holes
  for (let i = 0; i < 5; i++) s.add(cyl('bench_dog_' + i, 0.011, 0.011, 0.03, M.iron, x0 - 1.0 + i * 0.28, top + 0.05, z0 - 0.18, [0, 0, 0], 10));

  /* engineer's vise */
  const vx = x0 - 1.2, vy = top + 0.05, vz = z0 + 0.28;
  s.add(box('vise_base', 0.3, 0.06, 0.24, M.iron, vx, vy, vz));
  s.add(box('vise_body', 0.26, 0.15, 0.2, M.iron, vx, vy + 0.1, vz));
  s.add(box('vise_jaw_fixed', 0.3, 0.17, 0.055, M.iron, vx, vy + 0.15, vz + 0.09));
  s.add(box('vise_jaw_moving', 0.3, 0.17, 0.055, M.iron, vx, vy + 0.15, vz + 0.24));
  s.add(box('vise_jaw_face_a', 0.26, 0.1, 0.012, M.steel, vx, vy + 0.16, vz + 0.121));
  s.add(box('vise_jaw_face_b', 0.26, 0.1, 0.012, M.steel, vx, vy + 0.16, vz + 0.211));
  s.add(cyl('vise_screw', 0.022, 0.022, 0.38, M.steel, vx, vy + 0.13, vz + 0.19, [Math.PI / 2, 0, 0], 16));
  s.add(cyl('vise_tommy_bar', 0.014, 0.014, 0.32, M.steel, vx, vy + 0.13, vz + 0.38, [0, 0, Math.PI / 2], 12));
  [-0.16, 0.16].forEach((d, i) => s.add(cyl('vise_bar_end_' + i, 0.022, 0.022, 0.03, M.steel, vx + d, vy + 0.13, vz + 0.38, [0, 0, Math.PI / 2], 12)));

  /* work in progress: identical mounting plates in a tray */
  s.add(box('parts_tray', 0.46, 0.07, 0.34, M.greyWood, x0 - 0.15, top + 0.09, z0 - 0.12));
  for (let i = 0; i < 8; i++) {
    const px = x0 - 0.29 + (i % 4) * 0.095, pz = z0 - 0.19 + Math.floor(i / 4) * 0.13;
    s.add(box('mounting_plate_' + i, 0.085, 0.012, 0.085, M.steel, px, top + 0.13, pz));
    s.add(cyl('plate_stud_' + i, 0.011, 0.011, 0.05, M.steel, px, top + 0.16, pz, [0, 0, 0], 8));
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
      s.add(cyl('plate_hole_' + i + '_' + k, 0.007, 0.007, 0.016, M.iron, px + Math.cos(a) * 0.028, top + 0.132, pz + Math.sin(a) * 0.028, [0, 0, 0], 6));
    }
  }
  // hammer and a caliper left on the bench
  s.add(cyl('hammer_handle', 0.014, 0.011, 0.3, M.oakDark, x0 + 0.3, top + 0.06, z0 + 0.2, [0, 0, Math.PI / 2], 12));
  s.add(box('hammer_head', 0.09, 0.045, 0.045, M.iron, x0 + 0.47, top + 0.075, z0 + 0.2));
  s.add(box('caliper_beam', 0.26, 0.014, 0.03, M.steel, x0 + 0.35, top + 0.06, z0 - 0.05));
  s.add(box('caliper_jaw_fixed', 0.02, 0.06, 0.03, M.steel, x0 + 0.23, top + 0.08, z0 - 0.05));
  s.add(box('caliper_jaw_slide', 0.035, 0.055, 0.035, M.steel, x0 + 0.4, top + 0.08, z0 - 0.05));
  return s;
}

/* ─────────────── the master's own belt-drive unit ─────────────── */
function beltDrive() {
  const s = g('homemade_belt_drive');
  const x = -2.15, z = 0.45, deck = 0.9;
  [[-0.32, -0.26], [-0.32, 0.26], [0.32, -0.26], [0.32, 0.26]].forEach(([dx, dz], i) => {
    s.add(box('drive_leg_' + i, 0.06, deck, 0.06, M.iron, x + dx, deck / 2, z + dz));
    s.add(box('drive_foot_' + i, 0.1, 0.02, 0.1, M.iron, x + dx, 0.01, z + dz));
  });
  s.add(box('drive_deck', 0.82, 0.07, 0.66, M.iron, x, deck + 0.035, z));
  s.add(box('drive_brace_a', 0.72, 0.045, 0.045, M.iron, x, 0.26, z - 0.26));
  s.add(box('drive_brace_b', 0.72, 0.045, 0.045, M.iron, x, 0.26, z + 0.26));
  s.add(box('drive_brace_c', 0.045, 0.045, 0.56, M.iron, x - 0.32, 0.26, z));

  // motor
  s.add(cyl('motor_body', 0.115, 0.115, 0.34, M.iron, x - 0.2, deck + 0.2, z + 0.16, [0, 0, Math.PI / 2]));
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    s.add(box('motor_fin_' + i, 0.3, 0.02, 0.03, M.iron, x - 0.2, deck + 0.2 + Math.sin(a) * 0.12, z + 0.16 + Math.cos(a) * 0.12));
  }
  s.add(cyl('motor_endcap_a', 0.09, 0.09, 0.05, M.steel, x - 0.39, deck + 0.2, z + 0.16, [0, 0, Math.PI / 2], 20));
  s.add(cyl('motor_endcap_b', 0.09, 0.09, 0.05, M.steel, x - 0.01, deck + 0.2, z + 0.16, [0, 0, Math.PI / 2], 20));
  s.add(box('motor_terminal_box', 0.11, 0.07, 0.1, M.iron, x - 0.2, deck + 0.34, z + 0.16));
  s.add(cyl('motor_cable', 0.012, 0.012, 0.4, M.fabric, x - 0.2, deck + 0.2, z + 0.34, [Math.PI / 2, 0, 0], 8));
  s.add(cyl('motor_pulley', 0.052, 0.052, 0.05, M.steel, x + 0.06, deck + 0.2, z + 0.16, [0, 0, Math.PI / 2], 24));

  // shaft on pillow blocks
  s.add(cyl('drive_shaft', 0.019, 0.019, 0.66, M.steel, x + 0.02, deck + 0.34, z - 0.18, [0, 0, Math.PI / 2], 16));
  [-0.18, 0.16].forEach((dx, i) => {
    s.add(box('pillow_block_' + i, 0.1, 0.17, 0.11, M.iron, x + dx, deck + 0.25, z - 0.18));
    s.add(cyl('pillow_bearing_' + i, 0.037, 0.037, 0.06, M.steel, x + dx, deck + 0.34, z - 0.18, [0, 0, Math.PI / 2], 20));
    s.add(box('pillow_bolt_' + i, 0.13, 0.03, 0.13, M.steel, x + dx, deck + 0.09, z - 0.18));
  });
  s.add(cyl('shaft_pulley', 0.09, 0.09, 0.05, M.steel, x + 0.06, deck + 0.34, z - 0.18, [0, 0, Math.PI / 2], 28));

  // belt spanning the two pulleys
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.013, 8, 44), M.fabric);
  belt.name = 'drive_belt'; belt.castShadow = true; belt.receiveShadow = true;
  belt.position.set(x + 0.06, deck + 0.27, z - 0.01);
  belt.rotation.set(0, Math.PI / 2, 0);
  belt.scale.set(1, 1.35, 1);
  s.add(belt);
  s.add(box('belt_guard', 0.09, 0.4, 0.42, M.steel, x + 0.14, deck + 0.27, z - 0.01));

  // working disc and rest
  s.add(cyl('working_disc', 0.21, 0.21, 0.032, M.greyWood, x + 0.34, deck + 0.34, z - 0.18, [0, 0, Math.PI / 2], 44));
  s.add(cyl('disc_flange', 0.055, 0.055, 0.055, M.steel, x + 0.3, deck + 0.34, z - 0.18, [0, 0, Math.PI / 2], 20));
  s.add(cyl('disc_nut', 0.03, 0.03, 0.03, M.steel, x + 0.37, deck + 0.34, z - 0.18, [0, 0, Math.PI / 2], 6));
  s.add(box('disc_rest', 0.16, 0.03, 0.18, M.iron, x + 0.34, deck + 0.13, z - 0.18));
  s.add(box('disc_rest_arm', 0.05, 0.18, 0.05, M.iron, x + 0.34, deck + 0.03, z - 0.18));
  s.add(box('drive_switch_box', 0.1, 0.14, 0.06, M.paper, x - 0.36, deck + 0.5, z - 0.3));
  s.add(cyl('drive_switch_button', 0.02, 0.02, 0.02, M.red, x - 0.36, deck + 0.52, z - 0.33, [Math.PI / 2, 0, 0], 12));
  return s;
}

/* ─────────────── bench grinder on its pedestal ─────────────── */
function grinder() {
  const s = g('bench_grinder');
  const x = -2.8, z = 1.95, h = 0.98;
  s.add(cyl('grinder_base', 0.26, 0.28, 0.06, M.iron, x, 0.03, z, [0, 0, 0], 28));
  s.add(cyl('grinder_column', 0.062, 0.08, h, M.iron, x, h / 2, z, [0, 0, 0], 20));
  s.add(cyl('grinder_collar', 0.09, 0.09, 0.05, M.iron, x, h - 0.03, z, [0, 0, 0], 20));
  s.add(box('grinder_plate', 0.34, 0.03, 0.26, M.iron, x, h + 0.01, z));
  s.add(box('grinder_head', 0.44, 0.18, 0.2, M.iron, x, h + 0.11, z));
  s.add(cyl('grinder_shaft', 0.02, 0.02, 0.72, M.steel, x, h + 0.11, z, [0, 0, Math.PI / 2], 12));
  [-0.3, 0.3].forEach((dx, i) => {
    s.add(cyl('grinder_wheel_' + i, 0.115, 0.115, 0.028, i === 0 ? M.greyWood : M.oakDark, x + dx, h + 0.11, z, [0, 0, Math.PI / 2], 36));
    s.add(cyl('grinder_flange_' + i, 0.04, 0.04, 0.045, M.steel, x + dx - 0.02, h + 0.11, z, [0, 0, Math.PI / 2], 16));
    s.add(box('grinder_guard_' + i, 0.14, 0.18, 0.1, M.steel, x + dx, h + 0.17, z));
    s.add(box('grinder_rest_' + i, 0.1, 0.022, 0.11, M.steel, x + dx, h + 0.03, z + 0.13));
    s.add(box('grinder_rest_arm_' + i, 0.05, 0.06, 0.05, M.iron, x + dx, h + 0.02, z + 0.06));
  });
  s.add(box('grinder_shield', 0.52, 0.12, 0.012, M.glass, x, h + 0.3, z + 0.1));
  s.add(box('grinder_shield_arm', 0.03, 0.12, 0.1, M.steel, x, h + 0.24, z + 0.07));
  s.add(box('grinder_switch', 0.08, 0.1, 0.05, M.paper, x + 0.19, h + 0.02, z - 0.11));
  return s;
}

/* ─────────────── drilling / pressing station ─────────────── */
function drillPress() {
  const s = g('drill_press');
  const x = 0.85, z = -hd + 0.55;
  s.add(box('press_base', 0.5, 0.08, 0.44, M.iron, x, 0.04, z));
  for (let i = 0; i < 4; i++) {
    const dx = i % 2 ? 0.18 : -0.18, dz = i < 2 ? -0.15 : 0.15;
    s.add(cyl('press_base_bolt_' + i, 0.014, 0.014, 0.03, M.steel, x + dx, 0.09, z + dz, [0, 0, 0], 6));
  }
  s.add(cyl('press_column', 0.048, 0.048, 1.7, M.steel, x, 0.9, z - 0.14, [0, 0, 0], 24));
  s.add(box('press_table', 0.4, 0.055, 0.36, M.iron, x, 0.86, z + 0.04));
  for (let i = 0; i < 3; i++) s.add(box('press_table_slot_' + i, 0.03, 0.06, 0.34, M.plaster, x - 0.1 + i * 0.1, 0.865, z + 0.04));
  s.add(box('press_table_collar', 0.15, 0.14, 0.15, M.iron, x, 0.86, z - 0.14));
  s.add(cyl('press_table_crank', 0.012, 0.012, 0.14, M.steel, x + 0.14, 0.8, z - 0.14, [0, 0, Math.PI / 2], 10));
  s.add(box('press_head', 0.26, 0.26, 0.66, M.iron, x, 1.78, z + 0.02));
  s.add(cyl('press_motor', 0.105, 0.105, 0.28, M.iron, x, 1.86, z - 0.34, [Math.PI / 2, 0, 0], 24));
  s.add(box('press_belt_cover', 0.22, 0.2, 0.3, M.iron, x, 2.0, z - 0.16));
  s.add(cyl('press_quill', 0.032, 0.032, 0.24, M.steel, x, 1.52, z + 0.1, [0, 0, 0], 16));
  s.add(cyl('press_chuck', 0.048, 0.036, 0.12, M.steel, x, 1.37, z + 0.1, [0, 0, 0], 20));
  s.add(cyl('press_drill_bit', 0.006, 0.006, 0.15, M.steel, x, 1.25, z + 0.1, [0, 0, 0], 8));
  s.add(cyl('press_depth_ring', 0.05, 0.05, 0.03, M.brass, x + 0.13, 1.55, z + 0.02, [0, 0, 0], 18));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const spoke = cyl('press_feed_spoke_' + i, 0.012, 0.012, 0.26, M.steel, 0, 0, 0, [0, 0, 0], 10);
    spoke.position.set(x + 0.15, 1.62, z + 0.1);
    spoke.rotation.set(0, 0, Math.PI / 2);
    spoke.rotation.x = a;
    spoke.position.y += Math.cos(a) * 0.0;
    s.add(spoke);
    s.add(cyl('press_feed_knob_' + i, 0.018, 0.018, 0.04, M.oakDark,
      x + 0.15, 1.62 + Math.cos(a) * 0.13, z + 0.1 + Math.sin(a) * 0.13, [0, 0, Math.PI / 2], 12));
  }
  // work under the spindle plus a jig
  s.add(box('press_workpiece', 0.2, 0.03, 0.14, M.oak, x, 0.905, z + 0.04));
  s.add(box('press_jig', 0.16, 0.04, 0.2, M.greyWood, x - 0.13, 0.91, z + 0.1));
  s.add(box('press_vise', 0.18, 0.07, 0.13, M.iron, x + 0.14, 0.925, z + 0.02));
  return s;
}

/* ─────────────── yellow mitre saw on its own bench ─────────────── */
function mitreSaw() {
  const s = g('mitre_saw_station');
  const x = 1.95, z = -1.1, top = 0.86;
  s.add(box('saw_bench_top', 1.7, 0.08, 0.76, M.oak, x, top, z));
  [[-0.75, -0.3], [-0.75, 0.3], [0.75, -0.3], [0.75, 0.3]].forEach(([dx, dz], i) =>
    s.add(box('saw_bench_leg_' + i, 0.085, top - 0.08, 0.085, M.oak, x + dx, (top - 0.08) / 2, z + dz)));
  s.add(box('saw_bench_shelf', 1.5, 0.045, 0.64, M.oak, x, 0.3, z));
  s.add(box('saw_bench_rail', 1.5, 0.06, 0.04, M.oak, x, 0.62, z + 0.3));

  s.add(box('mitre_base', 0.6, 0.09, 0.54, M.yellow, x, top + 0.085, z));
  s.add(cyl('mitre_turntable', 0.21, 0.21, 0.055, M.iron, x, top + 0.14, z, [0, 0, 0], 32));
  s.add(box('mitre_kerf_plate', 0.36, 0.012, 0.1, M.steel, x, top + 0.168, z));
  s.add(box('mitre_fence_l', 0.28, 0.12, 0.055, M.steel, x - 0.16, top + 0.2, z - 0.2));
  s.add(box('mitre_fence_r', 0.28, 0.12, 0.055, M.steel, x + 0.16, top + 0.2, z - 0.2));
  s.add(box('mitre_scale', 0.5, 0.012, 0.05, M.steel, x, top + 0.135, z + 0.22));
  s.add(box('mitre_pivot_arm', 0.11, 0.36, 0.13, M.yellow, x + 0.03, top + 0.34, z - 0.17));
  s.add(cyl('mitre_pivot', 0.05, 0.05, 0.14, M.iron, x + 0.03, top + 0.5, z - 0.17, [0, 0, Math.PI / 2], 20));
  s.add(cyl('mitre_blade', 0.135, 0.135, 0.006, M.steel, x - 0.02, top + 0.38, z + 0.03, [0, 0, Math.PI / 2], 48));
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    s.add(box('mitre_tooth_' + i, 0.012, 0.016, 0.008, M.iron, x - 0.02, top + 0.38 + Math.sin(a) * 0.138, z + 0.03 + Math.cos(a) * 0.138));
  }
  s.add(cyl('mitre_arbor_cap', 0.035, 0.035, 0.03, M.iron, x + 0.01, top + 0.38, z + 0.03, [0, 0, Math.PI / 2], 14));
  s.add(box('mitre_guard', 0.07, 0.3, 0.3, M.yellow, x + 0.04, top + 0.4, z + 0.03));
  s.add(cyl('mitre_motor', 0.095, 0.095, 0.26, M.yellow, x + 0.21, top + 0.44, z + 0.03, [0, 0, Math.PI / 2], 24));
  s.add(cyl('mitre_motor_cap', 0.07, 0.07, 0.04, M.iron, x + 0.35, top + 0.44, z + 0.03, [0, 0, Math.PI / 2], 18));
  s.add(box('mitre_handle', 0.055, 0.1, 0.22, M.fabric, x + 0.02, top + 0.6, z + 0.22));
  s.add(box('mitre_trigger', 0.04, 0.04, 0.06, M.iron, x + 0.02, top + 0.55, z + 0.25));
  s.add(cyl('mitre_dust_port', 0.05, 0.05, 0.16, M.iron, x - 0.02, top + 0.5, z - 0.22, [Math.PI / 2, 0, 0], 18));
  s.add(box('mitre_bag', 0.16, 0.2, 0.2, M.fabric, x - 0.02, top + 0.46, z - 0.36));
  // stock and offcuts
  s.add(box('stock_board', 1.4, 0.035, 0.18, M.oak, x - 0.1, top + 0.18, z + 0.02));
  for (let i = 0; i < 4; i++) s.add(box('offcut_' + i, 0.5 - i * 0.08, 0.035, 0.15, M.oak, x - 0.2, 0.335 + i * 0.045, z - 0.2 + i * 0.13));
  return s;
}

/* ─────────────── shelving for the hardware store ─────────────── */
function shelving() {
  const s = g('parts_shelving');
  const x = hw - 0.26, h = 2.3, d = 0.46;
  [-1.55, 0.05].forEach((z0, bay) => {
    [-0.72, 0.72].forEach((dz, i) => s.add(box('shelf_upright_' + bay + '_' + i, d, h, 0.05, M.oak, x, h / 2, z0 + dz)));
    s.add(box('shelf_back_' + bay, 0.03, h, 1.45, M.oak, x + d / 2 - 0.02, h / 2, z0));
    for (let i = 0; i < 5; i++) {
      const y = 0.3 + i * 0.47;
      s.add(box('shelf_board_' + bay + '_' + i, d, 0.04, 1.45, M.oak, x, y, z0));
      for (let j = 0; j < 3; j++) {
        const bz = z0 - 0.48 + j * 0.48;
        const mat = (i + j) % 3 === 0 ? M.greyWood : M.oakDark;
        s.add(box('parts_bin_' + bay + '_' + i + '_' + j, 0.38, 0.21, 0.42, mat, x, y + 0.125, bz));
        s.add(box('bin_label_' + bay + '_' + i + '_' + j, 0.008, 0.075, 0.18, M.paper, x - 0.19, y + 0.14, bz));
        s.add(cyl('bin_pull_' + bay + '_' + i + '_' + j, 0.015, 0.015, 0.02, M.brass, x - 0.19, y + 0.215, bz, [0, 0, Math.PI / 2], 12));
        // a token of the contents, sitting proud of the bin
        if ((i + j) % 4 === 1) {
          s.add(torus('bin_hinge_' + bay + '_' + i + '_' + j, 0.04, 0.008, M.steel, x, y + 0.245, bz, [Math.PI / 2, 0, 0]));
        } else if ((i + j) % 4 === 2) {
          s.add(box('bin_bracket_' + bay + '_' + i + '_' + j, 0.09, 0.012, 0.06, M.steel, x, y + 0.24, bz));
          s.add(box('bin_bracket_leg_' + bay + '_' + i + '_' + j, 0.012, 0.06, 0.06, M.steel, x + 0.04, y + 0.27, bz));
        } else if ((i + j) % 4 === 3) {
          s.add(cyl('bin_studs_' + bay + '_' + i + '_' + j, 0.01, 0.01, 0.16, M.steel, x, y + 0.245, bz, [0, 0, Math.PI / 2], 8));
        }
      }
    }
    s.add(box('shelf_top_' + bay, d + 0.06, 0.05, 1.55, M.oak, x, h, z0));
  });
  // casters, boxed on the top shelf
  for (let i = 0; i < 4; i++) {
    const cz = -1.9 + i * 0.32;
    s.add(box('caster_bracket_' + i, 0.09, 0.1, 0.07, M.steel, x, h + 0.1, cz));
    s.add(cyl('caster_wheel_' + i, 0.05, 0.05, 0.035, M.fabric, x, h + 0.08, cz, [0, 0, Math.PI / 2], 20));
  }
  return s;
}

/* ─────────────── scales and the packing corner ─────────────── */
function packingCorner() {
  const s = g('packing_corner');
  const x = 2.1, z = hd - 1.2, top = 0.9;
  s.add(box('pack_bench_top', 1.05, 0.08, 1.3, M.oak, x, top, z));
  [[-0.42, -0.55], [-0.42, 0.55], [0.42, -0.55], [0.42, 0.55]].forEach(([dx, dz], i) =>
    s.add(box('pack_leg_' + i, 0.09, top - 0.08, 0.09, M.oak, x + dx, (top - 0.08) / 2, z + dz)));
  s.add(box('pack_shelf', 0.95, 0.045, 1.15, M.oak, x, 0.32, z));

  // trade scales with the indicator mast
  s.add(box('scale_body', 0.4, 0.11, 0.32, M.paper, x - 0.02, top + 0.1, z - 0.3));
  s.add(box('scale_pan', 0.38, 0.014, 0.3, M.steel, x - 0.02, top + 0.163, z - 0.3));
  s.add(box('scale_keys', 0.34, 0.02, 0.1, M.iron, x - 0.02, top + 0.16, z - 0.15));
  s.add(cyl('scale_mast', 0.016, 0.016, 0.44, M.steel, x - 0.02, top + 0.36, z - 0.42, [0, 0, 0], 12));
  s.add(box('scale_display', 0.24, 0.14, 0.07, M.iron, x - 0.02, top + 0.62, z - 0.42));
  s.add(box('scale_screen', 0.18, 0.07, 0.01, M.greyWood, x - 0.02, top + 0.63, z - 0.385));

  // tape, paper roll, labelled boxes
  s.add(cyl('tape_roll', 0.075, 0.075, 0.05, M.oakDark, x + 0.28, top + 0.09, z + 0.12, [Math.PI / 2, 0, 0], 24));
  s.add(cyl('tape_core', 0.03, 0.03, 0.055, M.paper, x + 0.28, top + 0.09, z + 0.12, [Math.PI / 2, 0, 0], 18));
  s.add(cyl('paper_roll', 0.1, 0.1, 0.42, M.paper, x - 0.02, top + 0.14, z + 0.45, [0, 0, Math.PI / 2], 28));
  for (let i = 0; i < 3; i++) {
    s.add(box('packing_box_' + i, 0.34, 0.22, 0.28, M.oakDark, x - 0.02, 0.45 + i * 0.23, z + 0.3));
    s.add(box('packing_box_label_' + i, 0.16, 0.08, 0.006, M.paper, x - 0.02, 0.47 + i * 0.23, z + 0.442));
  }
  s.add(box('ledger_pad', 0.2, 0.02, 0.26, M.paper, x + 0.28, top + 0.05, z - 0.28));
  return s;
}

/* ─────────────── vertical rack for sheet material ─────────────── */
function sheetRack() {
  const s = g('sheet_material_rack');
  const rack = g('rack_body');
  const x = 0, z = 0;
  s.add(box('rack_post_a', 0.08, 1.75, 0.08, M.iron, x + 0.58, 0.875, z - 0.08));
  s.add(box('rack_post_b', 0.08, 1.75, 0.08, M.iron, x - 0.58, 0.875, z - 0.08));
  s.add(box('rack_rail_top', 1.24, 0.06, 0.06, M.iron, x, 1.15, z - 0.08));
  s.add(box('rack_rail_mid', 1.24, 0.05, 0.05, M.iron, x, 0.55, z - 0.08));
  s.add(box('rack_foot_a', 0.1, 0.06, 0.58, M.iron, x + 0.58, 0.03, z - 0.34));
  s.add(box('rack_foot_b', 0.1, 0.06, 0.58, M.iron, x - 0.58, 0.03, z - 0.34));
  [[1.58, M.oak, 0.019], [1.42, M.greyWood, 0.017], [1.66, M.oakDark, 0.021], [1.3, M.oak, 0.016]].forEach((p, i) => {
    const panel = box('sheet_panel_' + i, 1.02 - i * 0.07, p[0], p[2], p[1], x - 0.03 + i * 0.035, p[0] / 2 + 0.07, z - 0.04 - i * 0.055);
    panel.rotation.x = -0.05;
    s.add(panel);
  });
  s.add(box('rack_label', 0.18, 0.09, 0.008, M.paper, x + 0.58, 1.5, z - 0.125));
  s.children.slice().forEach(c => rack.add(c));
  rack.position.set(2.95, 0, 2.25);
  rack.rotation.y = Math.PI / 2;
  s.add(rack);
  return s;
}

/* ─────────────── desk corner: notes, books, plant ─────────────── */
function deskCorner() {
  const s = g('desk_corner');
  const x = -1.35, z = hd - 0.55, top = 0.77;
  s.add(box('desk_top', 1.3, 0.06, 0.66, M.oak, x, top, z));
  [[-0.58, -0.27], [-0.58, 0.27], [0.58, -0.27], [0.58, 0.27]].forEach(([dx, dz], i) =>
    s.add(box('desk_leg_' + i, 0.07, top - 0.06, 0.07, M.oak, x + dx, (top - 0.06) / 2, z + dz)));
  s.add(box('desk_drawer', 0.44, 0.14, 0.6, M.oak, x + 0.38, top - 0.12, z));
  s.add(cyl('desk_pull', 0.013, 0.013, 0.14, M.brass, x + 0.38, top - 0.12, z - 0.3, [0, 0, Math.PI / 2], 12));

  s.add(box('ledger_sheet_a', 0.3, 0.012, 0.22, M.paper, x - 0.32, top + 0.036, z - 0.02));
  s.add(box('ledger_sheet_b', 0.28, 0.01, 0.2, M.paper, x - 0.25, top + 0.048, z + 0.06));
  for (let i = 0; i < 7; i++) s.add(box('ledger_line_' + i, 0.24, 0.002, 0.006, M.iron, x - 0.25, top + 0.054, z + 0.0 + i * 0.022));
  s.add(cyl('pencil', 0.006, 0.006, 0.17, M.yellow, x - 0.02, top + 0.038, z - 0.16, [0, 0.4, Math.PI / 2], 8));

  // the books — the master's own
  [M.canvasArt, M.iron, M.terracot, M.greyWood, M.oakDark].forEach((mat, i) => {
    const bk = box('book_' + i, 0.038 + (i % 2) * 0.008, 0.25 - (i % 3) * 0.022, 0.17, mat,
      x + 0.34 + i * 0.05, top + 0.155 - (i % 3) * 0.011, z - 0.18);
    if (i === 4) bk.rotation.z = 0.14;
    s.add(bk);
    s.add(box('book_band_' + i, 0.04 + (i % 2) * 0.008, 0.02, 0.172, M.brass, x + 0.34 + i * 0.05, top + 0.24 - (i % 3) * 0.022, z - 0.18));
  });
  s.add(box('book_end', 0.022, 0.17, 0.17, M.brass, x + 0.31, top + 0.115, z - 0.18));

  // a plant on the desk
  s.add(cyl('desk_pot', 0.09, 0.07, 0.14, M.terracot, x - 0.5, top + 0.1, z - 0.18, [0, 0, 0], 24));
  s.add(cyl('desk_pot_lip', 0.098, 0.098, 0.025, M.terracot, x - 0.5, top + 0.17, z - 0.18, [0, 0, 0], 24));
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const len = 0.2 + (i % 3) * 0.05;
    const lf = cyl('desk_leaf_' + i, 0.004, 0.035, len, M.leaf,
      x - 0.5 + Math.cos(a) * 0.055, top + 0.18 + len / 2, z - 0.18 + Math.sin(a) * 0.055, [0, 0, 0], 6);
    lf.rotation.set(Math.sin(a) * 0.5, a, -Math.cos(a) * 0.5);
    s.add(lf);
  }
  return s;
}

/* ─────────────── the chair the master made, and the cat bag ─────────────── */
function mastersChair() {
  const s = g('masters_chair');
  const px = -0.15, pz = hd - 0.5, seat = 0.43, ry = -0.35;
  const frame = g('chair_frame');
  [[-0.23, -0.21], [0.23, -0.21], [-0.23, 0.21], [0.23, 0.21]].forEach(([dx, dz], i) => {
    const tall = dz > 0;
    frame.add(box('chair_leg_' + i, 0.052, tall ? 0.88 : seat, 0.052, M.greyWood, dx, (tall ? 0.88 : seat) / 2, dz));
  });
  frame.add(box('chair_rail_front', 0.51, 0.055, 0.04, M.greyWood, 0, seat - 0.035, -0.21));
  frame.add(box('chair_rail_back', 0.51, 0.055, 0.04, M.greyWood, 0, seat - 0.035, 0.21));
  frame.add(box('chair_rail_l', 0.04, 0.055, 0.46, M.greyWood, -0.23, seat - 0.035, 0));
  frame.add(box('chair_rail_r', 0.04, 0.055, 0.46, M.greyWood, 0.23, seat - 0.035, 0));
  frame.add(box('chair_stretcher_side_l', 0.035, 0.04, 0.44, M.greyWood, -0.23, 0.16, 0));
  frame.add(box('chair_stretcher_side_r', 0.035, 0.04, 0.44, M.greyWood, 0.23, 0.16, 0));
  frame.add(box('chair_stretcher_mid', 0.5, 0.035, 0.035, M.greyWood, 0, 0.16, 0));
  frame.add(box('chair_back_top', 0.51, 0.08, 0.042, M.greyWood, 0, 0.85, 0.21));
  frame.add(box('chair_back_mid', 0.51, 0.055, 0.035, M.greyWood, 0, 0.66, 0.21));
  for (let i = 0; i < 6; i++) frame.add(box('seat_strap_' + i, 0.47, 0.013, 0.055, M.fabric, 0, seat + 0.012, -0.18 + i * 0.072));
  for (let i = 0; i < 5; i++) frame.add(box('seat_strap_cross_' + i, 0.055, 0.013, 0.44, M.fabric, -0.18 + i * 0.09, seat + 0.026, 0));
  [[-0.23, seat - 0.035, -0.21], [0.23, seat - 0.035, -0.21], [-0.23, seat - 0.035, 0.21], [0.23, seat - 0.035, 0.21],
   [-0.23, 0.85, 0.21], [0.23, 0.85, 0.21], [-0.23, 0.66, 0.21], [0.23, 0.66, 0.21]].forEach((p, i) => {
    frame.add(cyl('chair_bolt_' + i, 0.016, 0.016, 0.07, M.steel, p[0], p[1], p[2], [Math.PI / 2, 0, 0], 6));
    frame.add(cyl('chair_washer_' + i, 0.024, 0.024, 0.008, M.steel, p[0], p[1], p[2] + 0.032, [Math.PI / 2, 0, 0], 12));
  });
  frame.position.set(px, 0, pz);
  frame.rotation.y = ry;
  s.add(frame);

  // the black bag with the cat, hung on the chair back
  const bag = g('cat_bag');
  bag.add(box('bag_body', 0.31, 0.35, 0.14, M.fabric, 0, 0, 0));
  bag.add(box('bag_flap', 0.31, 0.11, 0.15, M.fabric, 0, 0.15, 0.006));
  bag.add(box('bag_seam', 0.31, 0.012, 0.152, M.greyWood, 0, 0.095, 0.006));
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.013, 8, 30, Math.PI), M.fabric);
  strap.name = 'bag_strap'; strap.castShadow = true; strap.receiveShadow = true;
  strap.position.set(0, 0.2, 0);
  bag.add(strap);
  bag.add(cyl('cat_head', 0.062, 0.062, 0.008, M.greyWood, 0, 0.02, 0.072, [Math.PI / 2, 0, 0], 24));
  const earL = box('cat_ear_l', 0.038, 0.05, 0.008, M.greyWood, -0.042, 0.068, 0.072);
  earL.rotation.z = 0.3; bag.add(earL);
  const earR = box('cat_ear_r', 0.038, 0.05, 0.008, M.greyWood, 0.042, 0.068, 0.072);
  earR.rotation.z = -0.3; bag.add(earR);
  bag.add(box('cat_body', 0.085, 0.1, 0.008, M.greyWood, 0, -0.065, 0.072));
  bag.add(cyl('cat_tail', 0.007, 0.007, 0.11, M.greyWood, 0.065, -0.085, 0.072, [0, 0, -0.8], 8));
  bag.position.set(px - 0.1, 0.68, pz + 0.29);
  bag.rotation.y = ry;
  s.add(bag);
  return s;
}

/* ─────────────── fittings: lamps, stool, plants, cart ─────────────── */
function fittings() {
  const s = g('fittings');
  PENDANTS.forEach(([x, z], i) => {
    s.add(cyl('pendant_cord_' + i, 0.006, 0.006, 0.72, M.iron, x, H - 0.5, z, [0, 0, 0], 8));
    s.add(cyl('pendant_canopy_' + i, 0.05, 0.05, 0.04, M.iron, x, H - 0.14, z, [0, 0, 0], 16));
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.27, 0.24, 30, 1, true), M.plaster);
    shade.name = 'pendant_shade_' + i;
    shade.material = M.plaster.clone();
    shade.material.name = 'pendant_shade_mat';
    shade.material.side = THREE.DoubleSide;
    shade.position.set(x, H - 0.98, z);
    shade.rotation.x = Math.PI;
    shade.castShadow = true;
    s.add(shade);
    s.add(torus('pendant_rim_' + i, 0.27, 0.012, M.brass, x, H - 1.1, z, [Math.PI / 2, 0, 0]));
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 14), new THREE.MeshStandardMaterial({
      name: 'bulb_' + i, color: 0xfff1d8, emissive: new THREE.Color(0xffd9a0), emissiveIntensity: 0.15, roughness: 0.4,
    }));
    bulb.name = 'pendant_bulb_' + i;
    bulb.position.set(x, H - 1.08, z);
    s.add(bulb);
  });

  // wall lamp over the workbench
  s.add(box('wall_lamp_arm', 0.34, 0.04, 0.04, M.brass, -2.3, 2.95, -hd + 0.2));
  s.add(cyl('wall_lamp_shade', 0.13, 0.06, 0.14, M.plaster, -2.3, 2.87, -hd + 0.36, [Math.PI, 0, 0], 20));
  s.add(box('wall_lamp_plate', 0.09, 0.14, 0.03, M.brass, -2.3, 2.95, -hd + 0.03));

  // stool
  s.add(cyl('stool_seat', 0.18, 0.18, 0.045, M.oakDark, -0.9, 0.58, 1.1, [0, 0, 0], 28));
  s.add(cyl('stool_seat_dish', 0.14, 0.14, 0.012, M.oak, -0.9, 0.605, 1.1, [0, 0, 0], 24));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const lg = cyl('stool_leg_' + i, 0.018, 0.024, 0.6, M.oakDark, -0.9 + Math.cos(a) * 0.13, 0.29, 1.1 + Math.sin(a) * 0.13, [0, 0, 0], 12);
    lg.rotation.set(Math.sin(a) * 0.15, 0, -Math.cos(a) * 0.15);
    s.add(lg);
    s.add(cyl('stool_rung_' + i, 0.011, 0.011, 0.2, M.oakDark, -0.9 + Math.cos(a + 1.05) * 0.11, 0.2, 1.1 + Math.sin(a + 1.05) * 0.11, [Math.PI / 2, a + 1.05 + Math.PI / 2, 0], 8));
  }

  // tool cart
  const cx = -0.05, cz = -0.85;
  s.add(box('cart_top', 0.62, 0.05, 0.44, M.oak, cx, 0.8, cz));
  s.add(box('cart_shelf_mid', 0.58, 0.04, 0.4, M.oak, cx, 0.5, cz));
  s.add(box('cart_shelf_low', 0.58, 0.04, 0.4, M.oak, cx, 0.24, cz));
  [[-0.27, -0.18], [-0.27, 0.18], [0.27, -0.18], [0.27, 0.18]].forEach(([dx, dz], i) => {
    s.add(box('cart_post_' + i, 0.035, 0.72, 0.035, M.iron, cx + dx, 0.44, cz + dz));
    s.add(cyl('cart_caster_' + i, 0.04, 0.04, 0.026, M.fabric, cx + dx, 0.04, cz + dz, [0, 0, Math.PI / 2], 16));
  });
  s.add(box('cart_drill_body', 0.2, 0.13, 0.09, M.iron, cx - 0.12, 0.87, cz));
  s.add(cyl('cart_drill_chuck', 0.026, 0.02, 0.07, M.steel, cx + 0.02, 0.87, cz, [0, 0, Math.PI / 2], 14));
  s.add(box('cart_drill_grip', 0.07, 0.14, 0.075, M.fabric, cx - 0.16, 0.76, cz));
  s.add(box('cart_battery', 0.09, 0.06, 0.08, M.fabric, cx - 0.16, 0.68, cz));
  s.add(box('cart_case', 0.34, 0.11, 0.26, M.iron, cx + 0.12, 0.56, cz));
  s.add(cyl('cart_tape_measure', 0.045, 0.045, 0.055, M.yellow, cx + 0.2, 0.86, cz + 0.1, [Math.PI / 2, 0, 0], 20));
  s.add(box('cart_box', 0.3, 0.15, 0.24, M.oakDark, cx, 0.32, cz));

  // floor plant between the windows
  s.add(cyl('floor_pot', 0.2, 0.15, 0.34, M.terracot, -hw + 0.42, 0.17, 0.05, [0, 0, 0], 28));
  s.add(cyl('floor_pot_lip', 0.215, 0.215, 0.045, M.terracot, -hw + 0.42, 0.33, 0.05, [0, 0, 0], 28));
  s.add(cyl('floor_pot_soil', 0.19, 0.19, 0.02, M.iron, -hw + 0.42, 0.335, 0.05, [0, 0, 0], 24));
  for (let i = 0; i < 13; i++) {
    const a = (i / 13) * Math.PI * 2 + 0.3;
    const r = 0.07 + (i % 3) * 0.04;
    const len = 0.5 + (i % 4) * 0.14;
    const lf = cyl('floor_leaf_' + i, 0.005, 0.055, len, M.leaf,
      -hw + 0.42 + Math.cos(a) * r, 0.36 + len / 2 - 0.03, 0.05 + Math.sin(a) * r, [0, 0, 0], 6);
    lf.rotation.set(Math.sin(a) * 0.42, a, -Math.cos(a) * 0.42);
    s.add(lf);
  }
  // small plant on the window sill
  s.add(cyl('sill_pot', 0.075, 0.06, 0.11, M.terracot, -hw + 0.14, 0.95, 1.3, [0, 0, 0], 20));
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const lf = cyl('sill_leaf_' + i, 0.004, 0.028, 0.16, M.leaf, -hw + 0.14 + Math.cos(a) * 0.045, 1.08, 1.3 + Math.sin(a) * 0.045, [0, 0, 0], 6);
    lf.rotation.set(Math.sin(a) * 0.6, a, -Math.cos(a) * 0.6);
    s.add(lf);
  }
  // broom by the door
  s.add(cyl('broom_handle', 0.014, 0.014, 1.35, M.oak, hw - 0.2, 0.7, hd - 1.9, [0.06, 0, 0.05], 12));
  s.add(box('broom_head', 0.08, 0.06, 0.22, M.oakDark, hw - 0.24, 0.06, hd - 1.86));
  s.add(box('broom_bristles', 0.07, 0.09, 0.2, M.greyWood, hw - 0.24, 0.02, hd - 1.86));
  return s;
}

const PENDANTS = [[-1.7, -0.4], [1.5, 0.5], [-0.2, 1.9]];

export function buildWorkshop() {
  const root = new THREE.Group();
  root.name = 'workshop_room_2';
  [shell(), toolWall(), workbench(), beltDrive(), grinder(), drillPress(), mitreSaw(),
   shelving(), packingCorner(), sheetRack(), deskCorner(), mastersChair(), fittings()]
    .forEach(p => root.add(p));
  return root;
}



export const HOTSPOTS = [
  {
    id: 'drive', title: 'Приводной узел — своя оснастка',
    text: 'Самодельная установка: электродвигатель, ременная передача, вал на двух опорах и рабочий диск. Собрана мастером, а не куплена готовой — её геометрия сохранена по фотографиям.',
    at: [-2.15, 1.45, 0.45], face: [0.2, 0.25, 1], cam: [-1.6, 2.05, 3.05],
  },
  {
    id: 'press', title: 'Сверление и прессование',
    text: 'Станок с колонной, подъёмным столом и патроном. Рядом — тиски и деревянный шаблон: отверстия и посадка деталей делаются по разметке и повторяются серией.',
    at: [0.85, 1.6, -1.9], face: [0.1, 0.2, 1], cam: [1.2, 2.2, 1.1],
  },
  {
    id: 'grinder', title: 'Заточка и шлифовка',
    text: 'Двухсторонний точильно-шлифовальный станок на стойке: два круга разной зернистости, подручники и защитный экран. Заточка инструмента и доводка металлических деталей.',
    at: [-2.8, 1.4, 1.95], face: [0.5, 0.2, 0.8], cam: [-1.35, 1.95, 4.15],
  },
  {
    id: 'mitre', title: 'Точный распил',
    text: 'Торцовочная пила на отдельном столе с упорами и шкалой углов. Точный поперечный распил дерева, фанеры и мебельных заготовок; обрезки хранятся под столом.',
    at: [1.95, 1.5, -1.1], face: [-0.1, 0.25, 1], cam: [1.7, 2.2, 1.75],
  },
  {
    id: 'bench', title: 'Верстак: ручная подгонка',
    text: 'Слесарные тиски, ящики с подписями, молоток и штангенциркуль. В лотке — партия одинаковых монтажных пластин с четырьмя отверстиями и центральным штифтом.',
    at: [-2.85, 1.2, -1.9], face: [0.3, 0.25, 1], cam: [-0.2, 2.1, 0.55],
  },
  {
    id: 'sawwall', title: 'Стена пил и измерительный инструмент',
    text: 'Ручные пилы и ножовки по размеру, длинные уровни и стальные линейки, набор точных отвёрток, разметочных шильев и ключей. Круглый знак над стеной — собственная марка мастерской.',
    at: [-1.2, 2.3, -2.6], face: [0, 0.1, 1], cam: [-2.4, 2.4, 3.6],
  },
  {
    id: 'packing', title: 'Фасовка и взвешивание',
    text: 'Торговые весы со стойкой-индикатором, упаковочная лента, рулон бумаги и подписанные коробки — так фиксировались партии деталей в реальной мастерской.',
    at: [2.1, 1.5, 1.5], face: [-0.6, 0.2, 0.6], cam: [-0.1, 2.3, 4.3],
  },
  {
    id: 'storage', title: 'Склад фурнитуры',
    text: 'Стеллажи с маркированными ящиками: петли, шарнирные механизмы, кронштейны, пластины, шпильки, гайки и мебельные колёса — партиями по типам и размерам.',
    at: [3.05, 1.85, -0.75], face: [-1, 0.15, 0.25], cam: [-0.8, 2.4, 0.2],
  },
  {
    id: 'sheets', title: 'Листовой материал',
    text: 'Вертикальная стойка для плит, фанеры и МДФ: листы стоят у рамы, а не лежат на полу — тот же запас материала, что и в реальной мастерской, но без хаоса.',
    at: [2.9, 1.45, 2.3], face: [-1, 0.2, -0.3], cam: [0.35, 2.1, 1.35],
  },
];

export const VIEWS = [
  { id: 'wide',     label: '01 · Общий вид',        cam: [1.1, 4.7, 9.6],   target: [0, 1.15, -0.2] },
  { id: 'volume',   label: '02 · Объём и свет',     cam: [0.6, 3.3, 8.4],   target: [-0.2, 1.9, -1.4] },
  { id: 'machines', label: '03 · Стена станков',    cam: [1.3, 2.25, 1.2],  target: [0.85, 1.5, -2.1] },
  { id: 'sawwall',  label: '04 · Стена пил и знак', cam: [-2.4, 2.45, 3.7], target: [-1.2, 2.3, -2.6] },
  { id: 'bench',    label: '05 · Верстак',          cam: [-0.2, 2.1, 0.55], target: [-2.85, 1.2, -1.9] },
  { id: 'grinding', label: '06 · Заточка',          cam: [-1.35, 1.95, 4.15], target: [-2.8, 1.4, 1.95] },
  { id: 'mitre',    label: '07 · Точный распил',    cam: [1.7, 2.2, 1.75],  target: [1.95, 1.5, -1.1] },
  { id: 'hardware', label: '08 · Склад фурнитуры',  cam: [-0.8, 2.4, 0.2],  target: [3.05, 1.85, -0.75] },
  { id: 'packing',  label: '09 · Фасовка',          cam: [-0.1, 2.3, 4.3],  target: [2.1, 1.5, 1.5] },
  { id: 'macro',    label: '10 · Деталь крупно',    cam: [-1.42, 1.4, -1.45], target: [-1.8, 1.04, -2.22] },
  { id: 'personal', label: '11 · Личный угол',      cam: [-2.5, 1.75, 4.6], target: [-0.7, 1.0, 2.2] },
  { id: 'assembly', label: '12 · Сборочный стол',   cam: [-1.5, 1.9, 3.4],  target: [0.4, 1.05, 0.6] },
];

export const ROOM = { W, D, H };


/* ═════════════ ROOM 1 · большая входная комната ═════════════ */
const R1 = { x0: -10.8, x1: -3.42, z0: -2.95, z1: 2.95, H: 4.0 };

function room1() {
  const s = g('room_1_entrance');
  const w = R1.x1 - R1.x0, d = R1.z1 - R1.z0, cx = (R1.x0 + R1.x1) / 2, cz = (R1.z0 + R1.z1) / 2;
  const floor = box('r1_floor', w, 0.1, d, M.stone, cx, -0.05, cz);
  floor.castShadow = false; s.add(floor);
  s.add(box('r1_wall_back', w + 0.24, R1.H, 0.12, M.plaster, cx, R1.H / 2, R1.z0 - 0.06));
  s.add(box('r1_wall_left', 0.12, R1.H, d, M.plaster, R1.x0 - 0.06, R1.H / 2, cz));
  s.add(box('r1_skirt_back', w, 0.13, 0.03, M.oak, cx, 0.065, R1.z0 + 0.015));
  s.add(box('r1_skirt_left', 0.03, 0.13, d, M.oak, R1.x0 + 0.015, 0.065, cz));
  s.add(box('r1_ceiling_band', w, 0.1, 1.6, M.plaster, cx, R1.H - 0.05, R1.z0 + 0.8));
  for (let i = 0; i < 5; i++) s.add(box('r1_beam_' + i, w, 0.22, 0.16, M.oak, cx, R1.H - 0.16, R1.z0 + 1.9 + i * 1.05));

  // three tall windows on the back wall, one on the left
  [-2.2, 0.4, 3.0].forEach((dx, i) => {
    const x = cx + dx, zz = R1.z0 - 0.06;
    s.add(box('r1_win_glass_' + i, 1.5, 2.1, 0.03, M.glass, x, 2.0, zz + 0.03));
    s.add(box('r1_win_head_' + i, 1.68, 0.1, 0.18, M.oak, x, 3.12, zz));
    s.add(box('r1_win_sill_' + i, 1.68, 0.1, 0.26, M.oak, x, 0.88, zz + 0.06));
    s.add(box('r1_win_rev_a_' + i, 0.1, 2.24, 0.18, M.oak, x - 0.79, 2.0, zz));
    s.add(box('r1_win_rev_b_' + i, 0.1, 2.24, 0.18, M.oak, x + 0.79, 2.0, zz));
    s.add(box('r1_win_mull_' + i, 0.055, 2.1, 0.1, M.oak, x, 2.0, zz + 0.02));
    s.add(box('r1_win_trans_' + i, 1.5, 0.05, 0.1, M.oak, x, 2.55, zz + 0.02));
  });
  // entrance door in the left wall, to the wooden porch
  s.add(box('r1_entry_leaf', 0.06, 2.2, 1.05, M.oakDark, R1.x0 + 0.02, 1.1, cz + 0.6));
  s.add(box('r1_entry_frame_a', 0.16, 2.32, 0.08, M.oak, R1.x0 - 0.02, 1.16, cz + 0.02));
  s.add(box('r1_entry_frame_b', 0.16, 2.32, 0.08, M.oak, R1.x0 - 0.02, 1.16, cz + 1.18));
  s.add(box('r1_entry_lintel', 0.16, 0.09, 1.26, M.oak, R1.x0 - 0.02, 2.28, cz + 0.6));
  s.add(cyl('r1_entry_handle', 0.018, 0.018, 0.14, M.brass, R1.x0 + 0.07, 1.05, cz + 1.02, [Math.PI / 2, 0, 0], 12));
  s.add(box('r1_door_mat', 0.9, 0.02, 1.2, M.greyWood, R1.x0 + 0.62, 0.01, cz + 0.6));

  // calculation desk with papers and a chair
  const dx0 = R1.x0 + 1.9, dz0 = 1.5, dtop = 0.77;
  s.add(box('r1_desk_top', 1.7, 0.07, 0.85, M.oak, dx0, dtop, dz0));
  [[-0.76, -0.36], [-0.76, 0.36], [0.76, -0.36], [0.76, 0.36]].forEach(([a, b], i) =>
    s.add(box('r1_desk_leg_' + i, 0.08, dtop - 0.07, 0.08, M.oak, dx0 + a, (dtop - 0.07) / 2, dz0 + b)));
  s.add(box('r1_desk_drawer', 0.5, 0.16, 0.78, M.oak, dx0 + 0.55, dtop - 0.13, dz0));
  s.add(cyl('r1_desk_pull', 0.013, 0.013, 0.16, M.brass, dx0 + 0.55, dtop - 0.13, dz0 - 0.39, [0, 0, Math.PI / 2], 12));
  s.add(box('r1_ledger_a', 0.34, 0.014, 0.25, M.paper, dx0 - 0.32, dtop + 0.042, dz0 - 0.04));
  s.add(box('r1_ledger_b', 0.3, 0.012, 0.22, M.paper, dx0 - 0.22, dtop + 0.055, dz0 + 0.1));
  for (let i = 0; i < 8; i++) s.add(box('r1_ledger_line_' + i, 0.26, 0.002, 0.006, M.iron, dx0 - 0.22, dtop + 0.062, dz0 + 0.02 + i * 0.024));
  s.add(cyl('r1_lamp_stem', 0.014, 0.014, 0.42, M.brass, dx0 + 0.6, dtop + 0.22, dz0 - 0.3, [0, 0, 0], 12));
  s.add(cyl('r1_lamp_base', 0.09, 0.1, 0.03, M.brass, dx0 + 0.6, dtop + 0.045, dz0 - 0.3, [0, 0, 0], 20));
  s.add(cyl('r1_lamp_shade', 0.13, 0.07, 0.13, M.plaster, dx0 + 0.52, dtop + 0.46, dz0 - 0.3, [Math.PI, 0, 0.3], 20));
  // simple chair, same构 language as the master's own
  const ch = g('r1_chair');
  [[-0.2, -0.19], [0.2, -0.19], [-0.2, 0.19], [0.2, 0.19]].forEach(([a, b], i) => {
    const tall = b > 0;
    ch.add(box('r1_chair_leg_' + i, 0.048, tall ? 0.84 : 0.44, 0.048, M.greyWood, a, (tall ? 0.84 : 0.44) / 2, b));
  });
  ch.add(box('r1_chair_seat', 0.46, 0.04, 0.42, M.oakDark, 0, 0.44, 0));
  ch.add(box('r1_chair_back', 0.46, 0.09, 0.04, M.greyWood, 0, 0.8, 0.19));
  ch.position.set(dx0 - 0.1, 0, dz0 - 0.85);
  ch.rotation.y = 0.25;
  s.add(ch);

  // bookcase with the master's books
  const bx = cx + 2.4, bz = R1.z0 + 0.34;
  s.add(box('r1_bookcase_side_a', 0.36, 2.1, 0.05, M.oak, bx - 0.62, 1.05, bz));
  s.add(box('r1_bookcase_side_b', 0.36, 2.1, 0.05, M.oak, bx + 0.62, 1.05, bz));
  s.add(box('r1_bookcase_back', 0.03, 2.1, 1.24, M.oak, bx, 1.05, bz - 0.16));
  for (let i = 0; i < 5; i++) {
    const y = 0.3 + i * 0.44;
    s.add(box('r1_shelf_' + i, 0.36, 0.04, 1.24, M.oak, bx, y, bz));
    const n = 7 + (i % 3);
    for (let k = 0; k < n; k++) {
      const mats = [M.canvasArt, M.iron, M.terracot, M.greyWood, M.oakDark, M.pink];
      const bk = box('r1_book_' + i + '_' + k, 0.16, 0.23 - (k % 3) * 0.025, 0.035 + (k % 2) * 0.012,
        mats[(i + k) % 6], bx, y + 0.135 - (k % 3) * 0.012, bz - 0.5 + k * 0.075);
      if (k === n - 1) bk.rotation.x = 0.28;
      s.add(bk);
    }
  }
  s.add(box('r1_bookcase_top', 0.42, 0.05, 1.34, M.oak, bx, 2.1, bz));

  // two tall cabinets
  [-0.4, 1.05].forEach((off, i) => {
    const kx = R1.x0 + 0.62, kz = -1.4 + off * 1.5;
    s.add(box('r1_cabinet_' + i, 1.0, 2.15, 0.62, M.oak, kx + 0.2, 1.075, kz));
    s.add(box('r1_cab_door_a_' + i, 0.03, 2.0, 0.28, M.oakDark, kx + 0.71, 1.075, kz - 0.15));
    s.add(box('r1_cab_door_b_' + i, 0.03, 2.0, 0.28, M.oakDark, kx + 0.71, 1.075, kz + 0.15));
    s.add(cyl('r1_cab_pull_a_' + i, 0.012, 0.012, 0.13, M.brass, kx + 0.73, 1.1, kz - 0.03, [0, 0, 0], 10));
    s.add(cyl('r1_cab_pull_b_' + i, 0.012, 0.012, 0.13, M.brass, kx + 0.73, 1.1, kz + 0.03, [0, 0, 0], 10));
  });

  // hand power tools on an open shelf
  const tx = cx - 0.6, tz = R1.z0 + 0.3;
  s.add(box('r1_tool_shelf', 2.2, 0.05, 0.34, M.oak, tx, 1.28, tz));
  s.add(box('r1_tool_shelf_brace_a', 0.05, 0.3, 0.3, M.iron, tx - 0.9, 1.12, tz));
  s.add(box('r1_tool_shelf_brace_b', 0.05, 0.3, 0.3, M.iron, tx + 0.9, 1.12, tz));
  for (let i = 0; i < 4; i++) {
    const px = tx - 0.78 + i * 0.52;
    s.add(box('r1_drill_body_' + i, 0.22, 0.14, 0.1, i % 2 ? M.iron : M.fabric, px, 1.38, tz));
    s.add(cyl('r1_drill_chuck_' + i, 0.028, 0.021, 0.08, M.steel, px + 0.15, 1.38, tz, [0, 0, Math.PI / 2], 14));
    s.add(box('r1_drill_grip_' + i, 0.075, 0.16, 0.08, M.fabric, px - 0.05, 1.24, tz));
    if (i % 2) s.add(box('r1_drill_batt_' + i, 0.1, 0.06, 0.09, M.iron, px - 0.05, 1.14, tz));
  }
  s.add(box('r1_case_a', 0.44, 0.13, 0.3, M.iron, tx + 0.6, 1.36, tz + 0.02));

  // the stove and its flue
  const sx = R1.x0 + 1.0, sz = R1.z0 + 0.9;
  s.add(box('r1_stove_body', 0.62, 0.82, 0.5, M.iron, sx, 0.53, sz));
  s.add(box('r1_stove_base', 0.72, 0.12, 0.6, M.stone, sx, 0.06, sz));
  s.add(box('r1_stove_door', 0.05, 0.36, 0.34, M.iron, sx + 0.32, 0.5, sz));
  s.add(cyl('r1_stove_handle', 0.014, 0.014, 0.12, M.brass, sx + 0.36, 0.5, sz + 0.2, [0, 0, 0], 10));
  s.add(box('r1_stove_top', 0.66, 0.05, 0.54, M.iron, sx, 0.96, sz));
  s.add(cyl('r1_stove_flue', 0.08, 0.08, 3.0, M.iron, sx, 2.48, sz, [0, 0, 0], 20));
  s.add(cyl('r1_stove_flue_collar', 0.1, 0.1, 0.08, M.iron, sx, 1.05, sz, [0, 0, 0], 20));
  s.add(box('r1_log_stack', 0.5, 0.4, 0.34, M.oakDark, sx + 0.75, 0.2, sz));

  // one large plant, one bench
  s.add(cyl('r1_pot', 0.24, 0.19, 0.4, M.terracot, cx + 1.0, 0.2, R1.z1 - 0.6, [0, 0, 0], 28));
  s.add(cyl('r1_pot_lip', 0.255, 0.255, 0.05, M.terracot, cx + 1.0, 0.39, R1.z1 - 0.6, [0, 0, 0], 28));
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.2, r = 0.08 + (i % 3) * 0.05, len = 0.6 + (i % 4) * 0.16;
    const lf = cyl('r1_leaf_' + i, 0.006, 0.06, len, M.leaf,
      cx + 1.0 + Math.cos(a) * r, 0.42 + len / 2 - 0.03, R1.z1 - 0.6 + Math.sin(a) * r, [0, 0, 0], 6);
    lf.rotation.set(Math.sin(a) * 0.4, a, -Math.cos(a) * 0.4);
    s.add(lf);
  }
  s.add(box('r1_bench_seat', 1.5, 0.06, 0.36, M.oakDark, R1.x0 + 1.5, 0.44, R1.z1 - 0.35));
  [[-0.65, 0], [0.65, 0]].forEach(([a], i) =>
    s.add(box('r1_bench_leg_' + i, 0.08, 0.44, 0.34, M.oak, R1.x0 + 1.5 + a, 0.22, R1.z1 - 0.35)));
  return s;
}

/* ═════════════ ROOM 3 · склад и тихий угол ═════════════ */
const R3 = { x0: 3.42, x1: 6.7, z0: -1.7, z1: 1.7, H: 3.0 };

function room3() {
  const s = g('room_3_storage');
  const w = R3.x1 - R3.x0, d = R3.z1 - R3.z0, cx = (R3.x0 + R3.x1) / 2, cz = (R3.z0 + R3.z1) / 2;
  const floor = box('r3_floor', w, 0.1, d, M.stone, cx, -0.05, cz);
  floor.castShadow = false; s.add(floor);
  s.add(box('r3_wall_back', w + 0.24, R3.H, 0.12, M.plaster, cx, R3.H / 2, R3.z0 - 0.06));
  s.add(box('r3_wall_right', 0.12, R3.H, d, M.plaster, R3.x1 + 0.06, R3.H / 2, cz));
  s.add(box('r3_ceiling', w + 0.24, 0.1, 1.5, M.plaster, cx, R3.H - 0.05, R3.z0 + 0.75));
  for (let i = 0; i < 3; i++) s.add(box('r3_beam_' + i, w, 0.18, 0.14, M.oak, cx, R3.H - 0.14, R3.z0 + 1.8 + i * 0.75));
  s.add(box('r3_skirt_back', w, 0.13, 0.03, M.oak, cx, 0.065, R3.z0 + 0.015));
  s.add(box('r3_skirt_right', 0.03, 0.13, d, M.oak, R3.x1 - 0.015, 0.065, cz));
  // window on the far wall
  s.add(box('r3_win_glass', 0.03, 1.2, 1.2, M.glass, R3.x1 + 0.03, 1.9, cz - 0.2));
  s.add(box('r3_win_head', 0.18, 0.1, 1.38, M.oak, R3.x1 + 0.06, 2.56, cz - 0.2));
  s.add(box('r3_win_sill', 0.24, 0.1, 1.38, M.oak, R3.x1 + 0.01, 1.24, cz - 0.2));
  s.add(box('r3_win_rev_a', 0.18, 1.34, 0.1, M.oak, R3.x1 + 0.06, 1.9, cz - 0.84));
  s.add(box('r3_win_rev_b', 0.18, 1.34, 0.1, M.oak, R3.x1 + 0.06, 1.9, cz + 0.44));

  // heavy racks along the back wall
  for (let bay = 0; bay < 2; bay++) {
    const rx = R3.x0 + 0.85 + bay * 1.55, rz = R3.z0 + 0.32;
    [-0.7, 0.7].forEach((dxx, i) => s.add(box('r3_post_' + bay + '_' + i, 0.06, 2.5, 0.55, M.iron, rx + dxx, 1.25, rz)));
    for (let i = 0; i < 5; i++) {
      const y = 0.35 + i * 0.52;
      s.add(box('r3_shelf_' + bay + '_' + i, 1.46, 0.05, 0.55, M.oak, rx, y, rz));
      for (let k = 0; k < 3; k++) {
        const mats = [M.oakDark, M.greyWood, M.oak];
        s.add(box('r3_box_' + bay + '_' + i + '_' + k, 0.42, 0.28, 0.44, mats[(i + k) % 3], rx - 0.48 + k * 0.48, y + 0.17, rz));
        s.add(box('r3_box_label_' + bay + '_' + i + '_' + k, 0.17, 0.09, 0.008, M.paper, rx - 0.48 + k * 0.48, y + 0.19, rz + 0.225));
      }
    }
  }
  // long stock leaning in the corner
  for (let i = 0; i < 6; i++) {
    const st = cyl('r3_long_stock_' + i, 0.028, 0.028, 2.5, i % 2 ? M.oak : M.steel,
      R3.x1 - 0.35 - (i % 3) * 0.09, 1.24, R3.z0 + 0.45 + Math.floor(i / 3) * 0.16, [0, 0, 0], 10);
    st.rotation.z = 0.07; st.rotation.x = -0.05;
    s.add(st);
  }
  s.add(box('r3_stock_cradle', 0.5, 0.12, 0.5, M.iron, R3.x1 - 0.45, 0.06, R3.z0 + 0.5));
  // sacks of fixings
  for (let i = 0; i < 3; i++) s.add(cyl('r3_sack_' + i, 0.19, 0.24, 0.5, M.greyWood, R3.x0 + 0.45, 0.25, cz + 0.5 + i * 0.42, [0, 0, 0], 16));

  // the rose sofa and its quiet corner
  const sx = cx + 0.25, sz = R3.z1 - 0.62;
  s.add(box('r3_sofa_seat', 1.75, 0.22, 0.72, M.pink, sx, 0.4, sz));
  s.add(box('r3_sofa_back', 1.75, 0.6, 0.2, M.pink, sx, 0.62, sz - 0.26));
  s.add(box('r3_sofa_arm_a', 0.18, 0.42, 0.72, M.pink, sx - 0.79, 0.5, sz));
  s.add(box('r3_sofa_arm_b', 0.18, 0.42, 0.72, M.pink, sx + 0.79, 0.5, sz));
  s.add(box('r3_sofa_base', 1.7, 0.16, 0.68, M.oakDark, sx, 0.2, sz));
  [[-0.75, -0.28], [0.75, -0.28], [-0.75, 0.28], [0.75, 0.28]].forEach(([a, b], i) =>
    s.add(cyl('r3_sofa_foot_' + i, 0.025, 0.02, 0.12, M.oakDark, sx + a, 0.06, sz + b, [0, 0, 0], 10)));
  s.add(box('r3_cushion_a', 0.42, 0.14, 0.42, M.oak, sx - 0.5, 0.56, sz - 0.05));
  s.add(box('r3_cushion_b', 0.4, 0.13, 0.4, M.canvasArt, sx + 0.48, 0.55, sz - 0.05));
  s.add(cyl('r3_side_table_top', 0.24, 0.24, 0.04, M.oakDark, sx - 1.1, 0.5, sz + 0.1, [0, 0, 0], 24));
  s.add(cyl('r3_side_table_stem', 0.03, 0.05, 0.48, M.iron, sx - 1.1, 0.24, sz + 0.1, [0, 0, 0], 14));
  s.add(box('r3_book_on_table', 0.16, 0.03, 0.12, M.terracot, sx - 1.1, 0.535, sz + 0.1));
  s.add(cyl('r3_plant_pot', 0.12, 0.1, 0.18, M.terracot, R3.x1 - 0.45, 0.09, R3.z1 - 0.4, [0, 0, 0], 20));
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, len = 0.26 + (i % 3) * 0.07;
    const lf = cyl('r3_leaf_' + i, 0.005, 0.035, len, M.leaf,
      R3.x1 - 0.45 + Math.cos(a) * 0.06, 0.18 + len / 2, R3.z1 - 0.4 + Math.sin(a) * 0.06, [0, 0, 0], 6);
    lf.rotation.set(Math.sin(a) * 0.45, a, -Math.cos(a) * 0.45);
    s.add(lf);
  }
  return s;
}

function extraFittings() {
  const s = g('room_1_3_fittings');
  ROOM1_PENDANTS.forEach(([x, z], i) => {
    s.add(cyl('r1_pendant_cord_' + i, 0.006, 0.006, 0.8, M.iron, x, R1.H - 0.5, z, [0, 0, 0], 8));
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.26, 30, 1, true), M.plaster.clone());
    shade.material.name = 'r1_shade_mat'; shade.material.side = THREE.DoubleSide;
    shade.name = 'r1_pendant_shade_' + i;
    shade.position.set(x, R1.H - 1.02, z); shade.rotation.x = Math.PI; shade.castShadow = true;
    s.add(shade);
    s.add(torus('r1_pendant_rim_' + i, 0.3, 0.012, M.brass, x, R1.H - 1.15, z, [Math.PI / 2, 0, 0]));
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 18, 12), new THREE.MeshStandardMaterial({
      name: 'r1_bulb_' + i, color: 0xfff1d8, emissive: new THREE.Color(0xffd9a0), emissiveIntensity: 0.15, roughness: 0.4 }));
    bulb.name = 'r1_pendant_bulb_' + i; bulb.position.set(x, R1.H - 1.12, z);
    s.add(bulb);
  });
  ROOM3_PENDANTS.forEach(([x, z], i) => {
    s.add(cyl('r3_pendant_cord_' + i, 0.006, 0.006, 0.5, M.iron, x, R3.H - 0.35, z, [0, 0, 0], 8));
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.2, 26, 1, true), M.plaster.clone());
    shade.material.name = 'r3_shade_mat'; shade.material.side = THREE.DoubleSide;
    shade.name = 'r3_pendant_shade_' + i;
    shade.position.set(x, R3.H - 0.72, z); shade.rotation.x = Math.PI; shade.castShadow = true;
    s.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), new THREE.MeshStandardMaterial({
      name: 'r3_bulb_' + i, color: 0xfff1d8, emissive: new THREE.Color(0xffd9a0), emissiveIntensity: 0.15, roughness: 0.4 }));
    bulb.name = 'r3_pendant_bulb_' + i; bulb.position.set(x, R3.H - 0.8, z);
    s.add(bulb);
  });
  return s;
}

const ROOM1_PENDANTS = [[-8.6, -1.2], [-6.4, 0.6], [-4.6, -1.6]];
const ROOM3_PENDANTS = [[4.5, -0.6], [5.9, 0.8]];



/* ═════ по референсам: верхний свет, обшивка, фартук, трек, сборочный стол ═════ */
function room2Upgrades() {
  const s = g('room_2_upgrades');
  const zw = -hd + 0.02;

  // clerestory band: a strip of daylight above the tool wall
  const sky = new THREE.MeshStandardMaterial({ name: 'daylight_panel', color: 0xf6fbff, roughness: 1,
    emissive: new THREE.Color(0xeaf4ff), emissiveIntensity: 0.55 });
  s.add(box('clerestory_daylight', 5.9, 0.62, 0.02, sky, 0, 3.28, -hd - 0.04));
  for (let i = 0; i < 3; i++) {
    const x = -2.0 + i * 2.0;
    s.add(box('clerestory_glass_' + i, 1.82, 0.6, 0.025, M.glass, x, 3.28, zw + 0.01));
    s.add(box('clerestory_mull_' + i, 0.07, 0.62, 0.09, M.oak, x + 1.0, 3.28, zw + 0.02));
  }
  s.add(box('clerestory_mull_end', 0.07, 0.62, 0.09, M.oak, -3.0, 3.28, zw + 0.02));
  s.add(box('clerestory_head', 6.1, 0.1, 0.13, M.oak, 0, 3.64, zw + 0.03));
  s.add(box('clerestory_sill', 6.1, 0.12, 0.16, M.oak, 0, 2.92, zw + 0.04));

  // light plank cladding on the upper wall, right of the sign
  for (let i = 0; i < 6; i++) {
    s.add(box('cladding_board_' + i, 2.9, 0.15, 0.028 + (i % 2) * 0.008, M.oak, 1.7, 1.72 + i * 0.16, zw + 0.02));
  }
  // concrete apron behind the bench, tool hooks on it
  s.add(box('bench_apron_panel', 3.1, 0.44, 0.03, M.stone, -1.7, 1.16, zw + 0.015));
  for (let i = 0; i < 9; i++) {
    s.add(cyl('apron_hook_' + i, 0.006, 0.006, 0.05, M.brass, -3.0 + i * 0.34, 1.31, zw + 0.04, [Math.PI / 2, 0, 0], 8));
  }

  // track lighting: two rails with small spots
  [-1.7, 1.5].forEach((x, r) => {
    s.add(box('track_rail_' + r, 0.05, 0.05, 4.2, M.iron, x, H - 0.24, 0.2));
    for (let i = 0; i < 3; i++) {
      const z = -1.4 + i * 1.6;
      s.add(cyl('track_head_' + r + '_' + i, 0.055, 0.055, 0.13, M.iron, x, H - 0.4, z, [0.35, 0, 0], 16));
      s.add(cyl('track_stem_' + r + '_' + i, 0.014, 0.014, 0.1, M.iron, x, H - 0.31, z, [0, 0, 0], 8));
    }
  });

  // central assembly table: oak top on black steel legs
  const tx = 0.4, tz = 0.6, tTop = 0.9;
  s.add(box('assembly_top', 1.55, 0.075, 0.88, M.oak, tx, tTop, tz));
  s.add(box('assembly_top_edge', 1.57, 0.02, 0.9, M.oakDark, tx, tTop - 0.048, tz));
  [[-0.68, -0.36], [-0.68, 0.36], [0.68, -0.36], [0.68, 0.36]].forEach(([a, b], i) =>
    s.add(box('assembly_leg_' + i, 0.07, tTop - 0.075, 0.07, M.iron, tx + a, (tTop - 0.075) / 2, tz + b)));
  s.add(box('assembly_rail_a', 1.4, 0.06, 0.05, M.iron, tx, 0.24, tz - 0.36));
  s.add(box('assembly_rail_b', 1.4, 0.06, 0.05, M.iron, tx, 0.24, tz + 0.36));
  s.add(box('assembly_shelf', 1.3, 0.04, 0.6, M.oakDark, tx, 0.3, tz));

  // flowers in a jug — the one soft note the references keep
  s.add(cyl('flower_jug', 0.075, 0.06, 0.19, M.stone, tx + 0.52, tTop + 0.13, tz - 0.16, [0, 0, 0], 24));
  s.add(cyl('flower_jug_neck', 0.055, 0.075, 0.05, M.stone, tx + 0.52, tTop + 0.25, tz - 0.16, [0, 0, 0], 20));
  const petals = [M.terracot, M.pink, M.yellow, M.brass, M.pink, M.terracot, M.yellow];
  petals.forEach((mat, i) => {
    const a = (i / petals.length) * Math.PI * 2, r = 0.05 + (i % 3) * 0.025, len = 0.2 + (i % 3) * 0.06;
    const stem = cyl('flower_stem_' + i, 0.004, 0.004, len, M.leaf,
      tx + 0.52 + Math.cos(a) * r * 0.6, tTop + 0.27 + len / 2, tz - 0.16 + Math.sin(a) * r * 0.6, [0, 0, 0], 6);
    stem.rotation.set(Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3);
    s.add(stem);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.028 + (i % 2) * 0.008, 12, 8), mat);
    head.name = 'flower_head_' + i; head.castShadow = true;
    head.position.set(tx + 0.52 + Math.cos(a) * r, tTop + 0.28 + len, tz - 0.16 + Math.sin(a) * r);
    s.add(head);
  });
  // a parts box and a notebook on the table
  s.add(box('assembly_parts_box', 0.34, 0.06, 0.24, M.oakDark, tx - 0.35, tTop + 0.07, tz + 0.06));
  for (let i = 0; i < 6; i++) s.add(cyl('assembly_bolt_' + i, 0.008, 0.008, 0.05, M.steel,
    tx - 0.45 + (i % 3) * 0.1, tTop + 0.11, tz + (i < 3 ? -0.02 : 0.12), [0, 0, 0], 6));
  s.add(box('assembly_notebook', 0.2, 0.025, 0.15, M.canvasArt, tx + 0.1, tTop + 0.05, tz + 0.24));

  // two small potted plants on shelves, as in the references
  [[2.35, 2.42, hd - 1.5], [-0.9, 1.36, -hd + 0.3]].forEach((p, k) => {
    s.add(cyl('shelf_pot_' + k, 0.065, 0.05, 0.1, M.terracot, p[0], p[1] + 0.05, p[2], [0, 0, 0], 18));
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2, len = 0.14 + (i % 3) * 0.05;
      const lf = cyl('shelf_leaf_' + k + '_' + i, 0.004, 0.026, len, M.leaf,
        p[0] + Math.cos(a) * 0.04, p[1] + 0.1 + len / 2, p[2] + Math.sin(a) * 0.04, [0, 0, 0], 6);
      lf.rotation.set(Math.sin(a) * 0.5, a, -Math.cos(a) * 0.5);
      s.add(lf);
    }
  });
  return s;
}

export function buildMaster() {
  const root = new THREE.Group();
  root.name = 'masterskaya_master_scene';
  root.add(buildWorkshop());
  root.add(room2Upgrades());
  return root;
}

export const PENDANT_POSITIONS = PENDANTS.map(([x, z]) => [x, H - 1.08, z]);


/* ═══════════ ASSET LIBRARY · отдельные объекты по фотобазе ═══════════ */

function assetVise() {
  const s = g('bench_vise_standalone');
  s.add(box('vise_mount_plate', 0.34, 0.03, 0.28, M.iron, 0, 0.015, 0));
  s.add(box('vise_base', 0.3, 0.06, 0.24, M.iron, 0, 0.06, 0));
  s.add(cyl('vise_swivel', 0.09, 0.1, 0.05, M.iron, 0, 0.11, 0, [0, 0, 0], 24));
  s.add(box('vise_body', 0.26, 0.15, 0.2, M.iron, 0, 0.2, 0));
  s.add(box('vise_jaw_fixed', 0.3, 0.17, 0.055, M.iron, 0, 0.25, 0.09));
  s.add(box('vise_jaw_moving', 0.3, 0.17, 0.055, M.iron, 0, 0.25, 0.24));
  s.add(box('vise_face_a', 0.26, 0.1, 0.012, M.steel, 0, 0.26, 0.121));
  s.add(box('vise_face_b', 0.26, 0.1, 0.012, M.steel, 0, 0.26, 0.211));
  s.add(cyl('vise_screw', 0.022, 0.022, 0.4, M.steel, 0, 0.23, 0.2, [Math.PI / 2, 0, 0], 20));
  s.add(cyl('vise_tommy_bar', 0.014, 0.014, 0.34, M.steel, 0, 0.23, 0.4, [0, 0, Math.PI / 2], 14));
  [-0.17, 0.17].forEach((d, i) => s.add(cyl('vise_bar_end_' + i, 0.022, 0.022, 0.03, M.steel, d, 0.23, 0.4, [0, 0, Math.PI / 2], 14)));
  s.add(box('vise_anvil', 0.12, 0.04, 0.1, M.iron, 0, 0.3, -0.12));
  return s;
}

function assetPlate() {
  const s = g('mounting_plate_assembly');
  s.add(box('plate_body', 0.1, 0.012, 0.1, M.steel, 0, 0.006, 0));
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    s.add(cyl('plate_hole_' + k, 0.007, 0.007, 0.016, M.iron, Math.cos(a) * 0.032, 0.006, Math.sin(a) * 0.032, [0, 0, 0], 12));
    s.add(torus('plate_hole_ring_' + k, 0.009, 0.002, M.steel, Math.cos(a) * 0.032, 0.013, Math.sin(a) * 0.032, [Math.PI / 2, 0, 0]));
  }
  s.add(cyl('plate_boss', 0.018, 0.02, 0.014, M.steel, 0, 0.019, 0, [0, 0, 0], 20));
  s.add(cyl('plate_stud', 0.0065, 0.0065, 0.075, M.steel, 0, 0.062, 0, [0, 0, 0], 16));
  for (let i = 0; i < 9; i++) s.add(torus('plate_thread_' + i, 0.007, 0.0012, M.steel, 0, 0.036 + i * 0.008, 0, [Math.PI / 2, 0, 0]));
  s.add(cyl('plate_nut', 0.011, 0.011, 0.008, M.iron, 0, 0.099, 0, [0, 0, 0], 6));
  s.add(cyl('plate_washer', 0.012, 0.012, 0.0015, M.steel, 0, 0.094, 0, [0, 0, 0], 18));
  return s;
}

function assetHinge() {
  const s = g('furniture_hinge');
  const leafW = 0.052, leafT = 0.004, leafL = 0.058, y0 = 0.0;
  function leaf(name, holePrefix) {
    const lf = g(name);
    lf.add(box(name + '_plate', leafW, leafT, leafL, M.steel, leafW / 2 + 0.008, 0, 0));
    for (let k = 0; k < 2; k++) {
      const z = -0.016 + k * 0.032;
      lf.add(cyl(holePrefix + '_hole_' + k, 0.004, 0.0055, 0.006, M.iron, leafW / 2 + 0.014, 0, z, [0, 0, 0], 12));
    }
    lf.add(box(name + '_edge', 0.004, leafT + 0.001, leafL, M.iron, leafW + 0.008, 0, 0));
    return lf;
  }
  const a = leaf('hinge_leaf_a', 'hinge_screw_a');
  a.position.set(0, y0, 0);
  s.add(a);
  const b = leaf('hinge_leaf_b', 'hinge_screw_b');
  b.position.set(0, y0, 0);
  b.rotation.z = -1.15;
  s.add(b);
  for (let k = 0; k < 3; k++) {
    s.add(cyl('hinge_knuckle_' + k, 0.0078, 0.0078, 0.018, M.steel, 0, y0, -0.019 + k * 0.019, [Math.PI / 2, 0, 0], 22));
  }
  [-0.0095, 0.0095].forEach((z, i) =>
    s.add(cyl('hinge_knuckle_gap_' + i, 0.0062, 0.0062, 0.018, M.iron, 0, y0, z, [Math.PI / 2, 0, 0], 18)));
  s.add(cyl('hinge_pin', 0.0024, 0.0024, 0.068, M.iron, 0, y0, 0, [Math.PI / 2, 0, 0], 14));
  [-0.034, 0.034].forEach((z, i) =>
    s.add(cyl('hinge_pin_end_' + i, 0.0034, 0.0034, 0.003, M.iron, 0, y0, z, [Math.PI / 2, 0, 0], 12)));
  return s;
}

function assetBracket() {
  const s = g('angle_bracket');
  s.add(box('bracket_wing_a', 0.09, 0.005, 0.05, M.steel, 0.045, 0.0025, 0));
  s.add(box('bracket_wing_b', 0.005, 0.075, 0.05, M.steel, 0.0025, 0.0375, 0));
  s.add(box('bracket_rib', 0.004, 0.05, 0.032, M.steel, 0.016, 0.028, 0));
  for (let k = 0; k < 2; k++) {
    s.add(cyl('bracket_hole_a_' + k, 0.004, 0.004, 0.008, M.iron, 0.03 + k * 0.035, 0.0025, 0, [0, 0, 0], 12));
    s.add(cyl('bracket_hole_b_' + k, 0.004, 0.004, 0.008, M.iron, 0.0025, 0.026 + k * 0.03, 0, [0, 0, Math.PI / 2], 12));
  }
  return s;
}

function assetCaster() {
  const s = g('furniture_caster');
  s.add(box('caster_plate', 0.075, 0.005, 0.075, M.steel, 0, 0.148, 0));
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    s.add(cyl('caster_plate_hole_' + k, 0.004, 0.004, 0.007, M.iron, Math.cos(a) * 0.026, 0.148, Math.sin(a) * 0.026, [0, 0, 0], 10));
  }
  [-1, 1].forEach((side, i) =>
    s.add(box('caster_fork_' + i, 0.006, 0.1, 0.055, M.steel, side * 0.03, 0.1, 0)));
  s.add(box('caster_fork_top', 0.066, 0.008, 0.055, M.steel, 0, 0.145, 0));
  s.add(cyl('caster_wheel', 0.05, 0.05, 0.032, M.fabric, 0, 0.05, 0, [0, 0, Math.PI / 2], 32));
  s.add(cyl('caster_hub', 0.018, 0.018, 0.038, M.steel, 0, 0.05, 0, [0, 0, Math.PI / 2], 20));
  s.add(cyl('caster_axle', 0.005, 0.005, 0.075, M.iron, 0, 0.05, 0, [0, 0, Math.PI / 2], 12));
  return s;
}

function assetStuds() {
  const s = g('threaded_rods_and_nuts');
  [-0.05, 0, 0.05].forEach((z, i) => {
    const len = 0.44 - i * 0.06;
    s.add(cyl('rod_' + i, 0.008, 0.008, len, M.steel, 0, 0.008, z, [0, 0, Math.PI / 2], 16));
    for (let k = 0; k < Math.round(len / 0.02); k++) {
      s.add(torus('rod_thread_' + i + '_' + k, 0.0085, 0.0012, M.steel, -len / 2 + 0.01 + k * 0.02, 0.008, z, [0, Math.PI / 2, 0]));
    }
  });
  for (let k = 0; k < 5; k++) {
    s.add(cyl('nut_' + k, 0.014, 0.014, 0.011, M.iron, -0.1 + k * 0.05, 0.0055, 0.12, [0, 0, 0], 6));
    s.add(cyl('nut_bore_' + k, 0.008, 0.008, 0.013, M.steel, -0.1 + k * 0.05, 0.0055, 0.12, [0, 0, 0], 14));
  }
  for (let k = 0; k < 4; k++) s.add(cyl('washer_' + k, 0.016, 0.016, 0.0015, M.steel, -0.075 + k * 0.05, 0.0008, 0.17, [0, 0, 0], 20));
  return s;
}

function assetFastenerTray() {
  const s = g('fastener_tray');
  s.add(box('tray_bottom', 0.46, 0.014, 0.34, M.oakDark, 0, 0.007, 0));
  s.add(box('tray_wall_a', 0.46, 0.05, 0.014, M.oakDark, 0, 0.032, -0.163));
  s.add(box('tray_wall_b', 0.46, 0.05, 0.014, M.oakDark, 0, 0.032, 0.163));
  s.add(box('tray_wall_c', 0.014, 0.05, 0.34, M.oakDark, -0.223, 0.032, 0));
  s.add(box('tray_wall_d', 0.014, 0.05, 0.34, M.oakDark, 0.223, 0.032, 0));
  for (let i = 1; i < 4; i++) s.add(box('tray_divider_x_' + i, 0.008, 0.036, 0.32, M.oak, -0.223 + i * 0.111, 0.028, 0));
  s.add(box('tray_divider_z', 0.44, 0.036, 0.008, M.oak, 0, 0.028, 0));
  // heaps of screws, bolts and nuts in the compartments
  let n = 0;
  for (let cx = 0; cx < 4; cx++) {
    for (let cz = 0; cz < 2; cz++) {
      const ox = -0.167 + cx * 0.111, oz = -0.082 + cz * 0.164;
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2 + cx, r = 0.02 + (k % 3) * 0.012;
        const kind = (cx + cz) % 3;
        const px = ox + Math.cos(a) * r, pz = oz + Math.sin(a) * r;
        if (kind === 0) {
          const sc = cyl('screw_' + n, 0.0035, 0.0018, 0.038, M.steel, px, 0.024, pz, [0, 0, 0], 8);
          sc.rotation.set(1.35, a, 0.2); s.add(sc);
          s.add(cyl('screw_head_' + n, 0.006, 0.006, 0.003, M.iron, px + Math.cos(a) * 0.017, 0.026, pz + Math.sin(a) * 0.017, [1.35, a, 0.2], 10));
        } else if (kind === 1) {
          s.add(cyl('nut_loose_' + n, 0.008, 0.008, 0.006, M.iron, px, 0.021, pz, [0, a, 0], 6));
        } else {
          const bo = cyl('bolt_' + n, 0.0035, 0.0035, 0.03, M.steel, px, 0.023, pz, [1.4, a, 0], 8);
          s.add(bo);
          s.add(cyl('bolt_head_' + n, 0.007, 0.007, 0.005, M.steel, px + Math.cos(a) * 0.014, 0.025, pz + Math.sin(a) * 0.014, [1.4, a, 0], 6));
        }
        n++;
      }
    }
  }
  for (let i = 0; i < 4; i++) s.add(box('tray_label_' + i, 0.05, 0.02, 0.006, M.paper, -0.167 + i * 0.111, 0.034, -0.169));
  return s;
}

function assetSawSet() {
  const s = g('hand_saw_set');
  [[0.86, 0.3, 0.14], [0.72, 0.26, 0.12], [0.6, 0.22, 0.1], [0.46, 0.18, 0.09]]
    .forEach(([len, hHandle, hTip], i) => {
      const y = 1.06 - i * 0.35;
      const sh = new THREE.Shape();
      sh.moveTo(0, 0); sh.lineTo(len, 0); sh.lineTo(len, -hHandle); sh.lineTo(0, -hTip); sh.closePath();
      const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.006, bevelEnabled: false }), M.steel);
      blade.name = 'saw_blade_' + i;
      blade.position.set(-len, y, 0);
      blade.castShadow = true; blade.receiveShadow = true;
      s.add(blade);
      s.add(box('saw_spine_' + i, len, 0.022, 0.014, M.iron, -len / 2, y - 0.008, 0.003));
      const teeth = box('saw_teeth_' + i, len, 0.018, 0.01, M.iron, -len / 2, y - (hHandle + hTip) / 2 + 0.01, 0.003);
      teeth.rotation.z = Math.atan2(hHandle - hTip, len);
      s.add(teeth);
      s.add(box('saw_handle_' + i, 0.15, hHandle + 0.06, 0.04, M.oakDark, 0.085, y - hHandle / 2, 0));
      s.add(torus('saw_handle_eye_' + i, 0.045, 0.013, M.oakDark, 0.095, y - hHandle / 2, 0));
    });
  return s;
}

function assetSign() {
  const s = g('round_workshop_sign');
  s.add(torus('sign_ring_outer', 0.44, 0.03, M.brass, 0, 0, 0));
  s.add(torus('sign_ring_inner', 0.31, 0.014, M.brass, 0, 0, 0));
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const t = box('sign_tooth_' + i, 0.05, 0.011, 0.028, M.brass, Math.cos(a) * 0.375, Math.sin(a) * 0.375, 0);
    t.rotation.z = a; s.add(t);
  }
  s.add(cyl('sign_hub', 0.07, 0.07, 0.035, M.brass, 0, 0, -0.005, [Math.PI / 2, 0, 0], 28));
  [0.6, -0.6].forEach((a, i) => {
    const bl = box('shear_blade_' + i, 0.52, 0.027, 0.013, M.steel, Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0.03);
    bl.rotation.z = a; s.add(bl);
    const tip = box('shear_tip_' + i, 0.1, 0.014, 0.012, M.steel, Math.cos(a) * 0.44, Math.sin(a) * 0.44, 0.03);
    tip.rotation.z = a; s.add(tip);
    s.add(torus('shear_bow_' + i, 0.065, 0.012, M.steel, -Math.cos(a) * 0.31, -Math.sin(a) * 0.31, 0.03));
  });
  return s;
}

const ASSET_BUILDERS = {
  press: drillPress, drive: beltDrive, grinder: grinder, mitre: mitreSaw,
  bench: workbench, vise: assetVise, shelving: shelving, packing: packingCorner,
  rack: sheetRack, sawset: assetSawSet, sign: assetSign, toolwall: toolWall,
  desk: deskCorner, chair: mastersChair,
  plate: assetPlate, hinge: assetHinge, bracket: assetBracket,
  caster: assetCaster, studs: assetStuds, tray: assetFastenerTray,
};

/** One catalogue object, re-centred on the origin with its base at y = 0. */
export function buildAsset(id) {
  const build = ASSET_BUILDERS[id];
  if (!build) throw new Error('unknown asset: ' + id);
  const inner = build();
  const bb = new THREE.Box3().setFromObject(inner);
  const c = bb.getCenter(new THREE.Vector3());
  inner.position.set(-c.x, -bb.min.y, -c.z);
  const root = new THREE.Group();
  root.name = 'asset_' + id;
  root.add(inner);
  return root;
}

export const ASSETS = [
  { group: 'Станки и приводы', items: [
    { id: 'press',  label: 'Сверлильный станок',
      text: 'Колонна, подъёмный стол с пазами, патрон и подача в три спицы; рядом машинные тиски и деревянный шаблон. Отверстия по разметке, повторяемые серией.' },
    { id: 'drive',  label: 'Самодельный приводной узел',
      text: 'Электродвигатель, ременная передача, вал на двух опорах-подшипниках и рабочий диск на сварной станине. Собран мастером — геометрия перенесена с фотографий, а не заменена магазинным аналогом.' },
    { id: 'grinder', label: 'Точильно-шлифовальный станок',
      text: 'Два круга разной зернистости на общем валу, подручники, кожухи и защитный экран, стойка с чугунным основанием. Заточка инструмента и доводка металлических деталей.' },
    { id: 'mitre',  label: 'Торцовочная пила',
      text: 'Поворотный стол со шкалой углов, упоры, диск с зубьями, кожух, патрубок и мешок для стружки. Точный поперечный распил дерева и мебельных заготовок.' },
  ] },
  { group: 'Верстак и оснастка', items: [
    { id: 'bench',  label: 'Верстак с тисками',
      text: 'Дубовая столешница с отверстиями под упоры, банк ящиков с подписями, слесарные тиски и лоток с партией монтажных пластин, молоток и штангенциркуль.' },
    { id: 'vise',   label: 'Тиски слесарные',
      text: 'Неподвижная и подвижная губки со стальными накладками, поворотное основание, ходовой винт и вороток. Фиксация детали для опиливания, сверления и подгонки.' },
    { id: 'toolwall', label: 'Стена инструмента',
      text: 'Щит с пилами, длинными уровнями и линейками, набором точных отвёрток и разметочных шильев, ключами по размеру, струбцинами; круглый знак и картина рядом.' },
    { id: 'sawset', label: 'Набор ручных пил',
      text: 'Четыре пилы и ножовки по убыванию: клиновидное полотно, обух, зубчатая кромка и деревянная рукоять с проушиной. Характерный набор со стены мастерской.' },
  ] },
  { group: 'Крепёж и фурнитура', items: [
    { id: 'plate',  label: 'Монтажная пластина',
      text: 'Квадратная пластина с четырьмя отверстиями и центральной резьбовой шпилькой с гайкой и шайбой. Самая повторяющаяся деталь на фотографиях — партии одинаковых элементов.' },
    { id: 'hinge',  label: 'Мебельная петля',
      text: 'Две карты с отверстиями под саморезы, три узла и ось. Форма снята с петель из фотобазы; назначение конкретного типа по фото не уточняется.' },
    { id: 'bracket', label: 'Уголок-кронштейн',
      text: 'L-образный кронштейн с ребром жёсткости и отверстиями в обеих полках. В мастерской такие лежат партиями — от простых уголков до специализированных пластин.' },
    { id: 'caster', label: 'Мебельное колесо',
      text: 'Колесо в вилке на оцинкованном кронштейне с площадкой под четыре винта. Фиксированное, без поворотного узла — как на фотографиях.' },
    { id: 'studs',  label: 'Шпильки, гайки, шайбы',
      text: 'Резьбовые стержни трёх длин, гайки M8 и шайбы. Расходный набор, вокруг которого строятся сборки и подгонка узлов.' },
    { id: 'tray',   label: 'Лоток крепежа',
      text: 'Деревянный лоток с перегородками и подписями: саморезы, болты и гайки разложены по типам и размерам. Так организован запас в мастерской.' },
  ] },
  { group: 'Хранение и комплектование', items: [
    { id: 'shelving', label: 'Стеллаж фурнитуры',
      text: 'Две секции с маркированными ящиками, на верхней полке — колёса в кронштейнах. Партии по типам и размерам: петли, кронштейны, пластины, шпильки, гайки.' },
    { id: 'packing',  label: 'Весы и упаковка',
      text: 'Торговые весы со стойкой-индикатором, упаковочная лента, рулон бумаги, подписанные коробки и ведомость на верстаке.' },
    { id: 'rack',     label: 'Стойка листового материала',
      text: 'Стальная рама с рейками и упорами: плиты, фанера и МДФ стоят вертикально, а не лежат на полу.' },
  ] },
  { group: 'Почерк мастера', items: [
    { id: 'sign',  label: 'Круглый настенный знак',
      text: 'Латунное кольцо с зубчатым венцом и раскрытые ножницы внутри — реальная настенная деталь, доведённая до узнаваемого знака мастерской.' },
    { id: 'chair', label: 'Стул мастера и сумка с котом',
      text: 'Серый деревянный каркас на болтовых соединениях, сиденье из натянутых чёрных лент. Сделан мастером за короткое время; на спинке — личная сумка с котом.' },
    { id: 'desk',  label: 'Стол расчётов и книги',
      text: 'Ведомости с рукописными расчётами, штангенциркуль, книги мастера с латунным упором и растение в терракотовом горшке.' },
  ] },
];
