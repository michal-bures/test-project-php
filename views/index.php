<div class="page-header">
<h1>PHP Test Application</h1>
</div>

<div class="panel panel-default">
<table class="table table-striped">
	<thead>
		<tr>
			<th scope="col">Name</th>
			<th scope="col">E-mail</th>
			<th scope="col">City</th>
		</tr>
	</thead>
	<tbody>
		<?foreach($users as $user){?>
		<tr>
			<td><?=$user->getName()?></td>
			<td><?=$user->getEmail()?></td>
			<td><?=$user->getCity()?></td>
		</tr>
		<?}?>
	</tbody>
</table>
</div>
<div class="panel panel-default">
    <div class="panel-heading">Add new user</div>
      <div class="panel-body">
        <form class="form-horizontal" method="post" action="create.php">
            <div class="form-group">
                <label for="name" class="col-sm-2 control-label">Name:</label>
                <div class="col-sm-6">
                    <input class="form-control" name="name" type="text"  id="name"/>
                </div>
            </div>
            <div class="form-group">
                <label for="email" class="col-sm-2 control-label">E-mail:</label>
                <div class="col-sm-6">
                    <input class="form-control" name="email" type="text" id="email"/>
                </div>
            </div>
            <div class="form-group">
                <label for="city" class="col-sm-2 control-label">City:</label>
                <div class="col-sm-6">
                    <input class="form-control" name="city" type="text" id="city"/>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-4">
                    <button class="btn btn-primary" type="submit">Create new row</button>
                </div>
            </div>
        </form>
      </div>
    </div>
</div>
