<script src="js/users-table-controller.js"></script>
<div class="page-header">
<h1>PHP Test Application</h1>
</div>

<div class="panel panel-default">
<table id='users-table' class="table table-striped">
	<thead>
		<tr>
			<th scope="col">Name</th>
			<th scope="col">E-mail</th>
			<th scope="col">City</th>
			<th scope="col">Phone Number</th>
		</tr>
	</thead>
	<tbody>
		<?foreach($users as $user){?>
		<tr>
			<td><?=$user->getName()?></td>
			<td><?=$user->getEmail()?></td>
			<td><?=$user->getCity()?></td>
			<td><?=$user->getPhoneNumber()?></td>
		</tr>
		<?}?>
	</tbody>
</table>
</div>

<div class="panel panel-default">
    <div class="panel-heading">Add new user</div>
      <div class="panel-body">
        <form onsubmit="event.preventDefault();" id="add-new-user-form" class="form-horizontal">
            <div id="group-name" class="form-group">
                <label for="name" class="col-sm-2 control-label">Name:</label>
                <div class="col-sm-6">
                    <input class="form-control" name="name" type="text"  id="name"/>
                </div>
                <span class="help-block"></span>
            </div>
            <div id="group-email" class="form-group">
                <label for="email" class="col-sm-2 control-label">E-mail:</label>
                <div class="col-sm-6">
                    <input class="form-control" name="email" type="text" id="email"/>
                </div>
                <span class="help-block"></span>
            </div>
            <div id="group-city" class="form-group">
                <label for="city" class="col-sm-2 control-label">City:</label>
                <div class="col-sm-6">
                    <input class="form-control" name="city" type="text" id="city"/>
                </div>
                <span class="help-block"></span>
            </div>
            <div id="group-phone" class="form-group">
                <label for="phone" class="col-sm-2 control-label">Phone:</label>
                <div class="col-sm-6">
                    <input class="form-control" name="phone" type="tel" id="phone" placeholder="+420 123456789"/>
                </div>
                <span class="help-block"></span>
            </div>
            <div id="group-submit" class="form-group">
                <div class="col-sm-offset-2 col-sm-3">
                    <button id="submit-button" class="btn btn-primary" type="submit">Add user</button>
                </div>
                 <span class="help-block"></span>
            </div>
        </form>
      </div>
    </div>
</div>
