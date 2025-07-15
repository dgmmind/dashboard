<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Registro de Usuario</title>
</head>
<body>
<h1>Registro de Usuario</h1>
<form id="registerForm">
    <label>
        Nombre:
        <input type="text" name="name" required />
    </label><br/>
    <label>
        Email:
        <input type="email" name="email" required />
    </label><br/>
    <label>
        Contraseña:
        <input type="password" name="password" required />
    </label><br/>
    <label>
        Rol:
        <select name="role_name" required>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
        </select>
    </label><br/><br/>
    <button type="submit">Registrar</button>
</form>

<script>
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(form);

        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            role_name: formData.get('role_name'),
        };

        fetch('http://localhost/dgmmind/clean-architecture/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                console.log('Usuario registrado:', result);
                alert('Usuario registrado con éxito');
                form.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al registrar usuario');
            });
    });
</script>
</body>
</html>
