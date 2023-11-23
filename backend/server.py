from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pymysql
from datetime import datetime
import os
import io
import hashlib
from minio import Minio
from minio.error import S3Error
import hashlib
from datetime import timedelta
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', 'Deeptanshu1!!')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'DSC')

minio_host = os.getenv('MINIO_HOST', 'localhost:9000')
minio_access_key = os.getenv('MINIO_ACCESS_KEY', 'U2YahjD8umhyfWkGTvqE')
minio_secret_key = os.getenv('MINIO_SECRET_KEY', 'Pi0XpMIhITArbnnTftGqxZczH5k6uNDV20n1DVRe')
minio_bucket = os.getenv('MINIO_BUCKET', 'files')

mysql = pymysql.connect(
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    db=app.config['MYSQL_DB'],
    cursorclass=pymysql.cursors.DictCursor
)
app.mysql = mysql

minio_client = Minio(
    minio_host,
    access_key=minio_access_key,
    secret_key=minio_secret_key,
    secure=False
)

@app.route('/register', methods=['POST'])
def registerFunc():
    try:
        data = request.json
        username = data.get('username')
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        with mysql.cursor() as cursor:
            cursor.execute("INSERT INTO userinfo (username, name, email, password) VALUES (%s, %s, %s, %s)", (username, name, email, password))
            mysql.commit()
        return jsonify({"status": "success", "message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        if request.method == 'POST':
            data = request.json
            username = data.get('username')
            password = data.get('password')

            with mysql.cursor() as cursor:
                cursor.execute("SELECT * FROM userinfo WHERE username = (%s) AND password = (%s)", (username, password))
                result = cursor.fetchone()
                if result:
                    return jsonify({"status": "success", "username": f'{username}', "message": "User logged in successfully"}), 200
                else:
                    return jsonify({"status": "error", "message": "Invalid username or password"}), 401
    except Exception as e:
        print("Error:", e) 
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/viewFiles', methods=['GET'])
def viewFiles():
    try:
        username = request.args.get('username')  # Get username from query parameter
        print("Username:", username)
        files_data = []
        with mysql.cursor() as cursor:
            cursor.execute("SELECT filename, checksum, uploadtime FROM `DSC`.`fileinfo` WHERE username = %s", (username))
            results = cursor.fetchall()

            for row in results:
                checkSum = row['checksum']
                fileName = row['filename']
                uploadTime = row['uploadtime']

                try:
                    presigned_url = minio_client.presigned_get_object("files", checkSum, expires=timedelta(days=1))
                    file_data = {
                        "fileName" : fileName,
                        "checkSum": checkSum,
                        "url": presigned_url, 
                        "uploadTime": uploadTime,
                    }
                    files_data.append(file_data)
                except S3Error as e:
                    print(f"Error retrieving file {checkSum}: {str(e)}")

        return jsonify(files_data)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/fileUpload', methods=['POST'])
def fileUpload():
    try:        
        if 'file' not in request.files:
            return jsonify({"status": "error", "message": "No file part"}), 400

        file = request.files['file']
        username = request.form.get('username')
        fileName = request.form.get('fileName')
        if len(fileName) > 30:
            fileName = fileName[:30]
        x = datetime.now()
        formatted_time = x.strftime("%Y-%m-%d %H:%M:%S")
        microseconds = x.strftime("%f")[:0]  # Gets the first two digits of the microseconds
        uploadTime = formatted_time + microseconds

        if file.filename == '':
            return jsonify({"status": "error", "message": "No selected file"}), 400

        if file:
            filename = secure_filename(file.filename)
            file_contents = file.read()
            fileHash = hashlib.sha256(file_contents).hexdigest()

        found = minio_client.bucket_exists("files")
        if not found:
            print("Inside bucket creation")
            minio_client.make_bucket("files")
        else:
            print("files bucket already exists!")

        minio_client.stat_object("files", fileHash)
        return jsonify({"status": "error file already exists"}), 500
    except S3Error as e:
        if e.code == 'NoSuchKey':
            minio_client.put_object("files", fileHash, io.BytesIO(file_contents), len(file_contents), part_size=10*1024*1024)
            with mysql.cursor() as cursor:
                cursor.execute("INSERT INTO fileinfo (username, checksum, filename, uploadtime) VALUES (%s, %s, %s, %s)", (username, fileHash, fileName, uploadTime))
                mysql.commit()
            return jsonify({'hash': fileHash, 'reason': 'File sent to minio'}), 200
        else:
            print(str(e))
            return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/', methods=['GET'])
def hello():
    return '<h1>File DeDuplication Backend Service is running</h1><p>Use a valid endpoint</p>'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
