-- Primero tablas independientes
CREATE TABLE group_teachers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(500)
);

CREATE TABLE accompanying_teacher (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(500)
);

CREATE TABLE zone_supervisors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(500)
);

CREATE TABLE sector_chiefs (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(500)
);

CREATE TABLE semesters (
    id SERIAL PRIMARY KEY,
    semester_name VARCHAR(500)
);

CREATE TABLE contexts (
    id SERIAL PRIMARY KEY,
    context_name VARCHAR(500)
);

-- Luego tablas con dependencias simples
CREATE TABLE intern_students (
    id SERIAL PRIMARY KEY,
    control_number VARCHAR(500),
    full_name VARCHAR(500),
    semester_id INTEGER REFERENCES semesters(id),
    accumulated_hours INTEGER
);

CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    cct VARCHAR(500),
    school_name VARCHAR(500),
    director_name VARCHAR(500),
    address VARCHAR(500),
    sector VARCHAR(500),
    zone VARCHAR(500),
    locality VARCHAR(500),
    sector_cheif_id INTEGER REFERENCES sector_chiefs(id),
    zone_supervisor INTEGER REFERENCES zone_supervisors(id),
    context_id INTEGER REFERENCES contexts(id)
);

CREATE TABLE assigned_tutors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(500),
    school_id INTEGER REFERENCES schools(id)
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(500),
    teacher_id INTEGER REFERENCES group_teachers(id)
);

-- Finalmente tablas con múltiples dependencias
CREATE TABLE groups_students (
    id SERIAL PRIMARY KEY,
    id_student INTEGER REFERENCES intern_students(id),
    id_group INTEGER REFERENCES groups(id)
);

CREATE TABLE practices (
    id BIGSERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(id),
    student_id INTEGER REFERENCES intern_students(id),
    group_teacher_id INTEGER REFERENCES group_teachers(id),
    initial_date TIMESTAMP,
    final_date TIMESTAMP,
    accompanying_teacher_id INTEGER REFERENCES accompanying_teacher(id),
    grade_and_group VARCHAR(500),
    assigned_tutor_id INTEGER REFERENCES assigned_tutors(id),
    practice_hours INTEGER
);