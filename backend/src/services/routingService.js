const db = require('../db');

const categoryTypeMap = {
  potholes: 'municipal',
  garbage_dumping: 'municipal',
  broken_street_lights: 'ceb',
  water_drainage_blocks: 'water_board'
};

async function findDepartmentForReport({ latitude, longitude, category }) {
  const preferredType = categoryTypeMap[category] || null;

  const params = [longitude, latitude, preferredType];
  const query = `
    WITH input_point AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT d.id, d.name, d.type
    FROM departments d, input_point p
    WHERE ST_Contains(d.region_polygon, p.geom)
      AND ($3::department_type IS NULL OR d.type = $3::department_type)
    ORDER BY d.id
    LIMIT 1
  `;

  const direct = await db.query(query, params);
  if (direct.rows[0]) {
    return direct.rows[0];
  }

  if (!preferredType) {
    return null;
  }

  const fallback = await db.query(
    `
      SELECT id, name, type
      FROM departments
      WHERE type = $1::department_type
      ORDER BY id
      LIMIT 1
    `,
    [preferredType]
  );

  return fallback.rows[0] || null;
}

module.exports = {
  findDepartmentForReport,
  categoryTypeMap
};
