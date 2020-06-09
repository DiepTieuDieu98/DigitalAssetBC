

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css">
	<link rel="stylesheet" href="AssetCopyRight.css">
</head>
<body>
	<div class="container">
	    <article class="card">
	        <header class="card-header"> Quản lý bản quyền </header>
	        <div class="card-body">
	            <h6>Mã nhạc số: DAM5345435</h6>
	            <article class="card">
	                <div class="card-body row">
	                    <div class="col"> <strong>Ngày tạo:</strong> <br>29 nov 2019 </div>
	                    <div class="col"> <strong>Sở hữu bởi:</strong> <br> BLUEDART, | <i class="fa fa-phone"></i> +1598675986 </div>
	                    <div class="col"> <strong>Trạng thái:</strong> <br> Picked by the courier </div>
	                    <div class="col"> <strong>Người tạo:</strong> <br> BLUEDART </div>
	                </div>
	            </article>
	            <div class="track">
	                <div class="step active"> <span class="icon"> <i class="fa fa-check"></i> </span> <span class="text"> Upload nhạc số và gán bản quyền </span> </div>
	                <div class="step active"> <span class="icon"> <i class="fa fa-user"></i> </span> <span class="text"> In vết bản quyền </span> </div>
	                <div class="step active"> <span class="icon"> <i class="fa fa-user-check"></i> </span> <span class="text"> Kiểm tra kết quả </span> </div>
	                <div class="step active"> <span class="icon"> <i class="fa fa-box"></i> </span> <span class="text"> Xuất file mã hóa </span> </div>
	            </div>
	            <hr>
	            <ul class="row">
	                <li class="col-md-12">
						<div class="encrypt-file">
					  		<h4 style="text-align: center;">Tải File Mã Hóa</h4>
					  		<div style="" class="col-md-12">
					  			<form method="POST" enctype="multipart/form-data" action="FileEncrypt.php">
						  			<div class="form-group">
								    	<label for="file_encrypt">File mã hóa:</label>
								    	<input type="file" name="file_encrypt" class="form-control" id="file_encrypt" required>
								  	</div>
								  	<div class="form-group">
								    	<label for="text-logo">Mật khẩu mã hóa:</label>
								    	<input type="password" name="pass_encrypt" class="form-control" placeholder="Enter password" id="pass_encrypt" required>
								  	</div>
								  	<input type="submit" class="btn btn-success" value="Xác nhận">
						  		</form>
					  		</div>
					  	</div>
	                </li>
	            </ul>
	            <hr>
	        </div>
	    </article>
	</div>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="AssetCopyRight.js"></script> 
</body>
</html>

