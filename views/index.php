<div class="page-header">
<h1>PHP Test Application</h1>
</div>

<div class="panel panel-default table-responsive">
<table id='users-table' class="table">
	<thead>
		<tr>
			<th scope="col" class="col-sm-3">Name</th>
			<th scope="col" class="col-sm-3">E-mail</th>
			<th scope="col" class="col-sm-3">City</th>
			<th scope="col" class="col-sm-3">Phone Number</th>
		</tr>
		<tr>
			<th></th>
			<th></th>
			<th>
			   <div class="input-group">
			      <input class="form-control" type="text" id="filter-city" placeholder="Filter city"></input>
                  <span class="input-group-addon"><span class="glyphicon glyphicon-filter" aria-hidden="true"></span></span>
               </div>
			</th>
			<th>
		</tr>
	</thead>
	<tbody>
		<tr id="filter-status-row" class="hidden warning">
		    <td colspan="4" >
		      <span id="filter-status-message"></span>
              <button type="button" class="close" id="reset-filter-button" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		    </td>
		</tr>
		<?foreach($users as $user){?>
		<tr class="user-row">
			<td><?=$user->getName()?></td>
			<td><?=$user->getEmail()?></td>
			<td class="city-cell"><?=$user->getCity()?></td>
			<td><?=$user->getPhoneNumber()?></td>
		</tr>
		<?}?>
	</tbody>
</table>
</div>

<script src="js/users-table-controller.js" defer></script>
<div class="panel panel-default">
    <div class="panel-heading">Add new user</div>
      <div class="panel-body">
        <form id="add-new-user-form" class="form-horizontal">
            <div id="group-name" class="form-group">
                <label for="name" class="col-sm-2 control-label">Name:</label>
                <div class="col-sm-4">
                    <input class="form-control" name="name" type="text"  id="name"/>
                </div>
                <span class="help-block col-sm-4"></span>
            </div>
            <div id="group-email" class="form-group">
                <label for="email" class="col-sm-2 control-label">E-mail:</label>
                <div class="col-sm-4">
                    <input class="form-control" name="email" type="email" id="email"/>
                </div>
                <span class="help-block col-sm-4"></span>
            </div>
            <div id="group-city" class="form-group">
                <label for="city" class="col-sm-2 control-label">City:</label>
                <div class="col-sm-4">
                    <input class="form-control" name="city" type="text" id="city"/>
                </div>
                <span class="help-block col-sm-4"></span>
            </div>
            <div id="group-phone" class="form-group">
                <label for="phone" class="col-sm-2 control-label">Phone:</label>
                <div class="col-sm-4">
                    <input class="form-control" name="phone" type="tel" id="phone" placeholder="+420 123456789"/>
                </div>
                <span class="help-block col-sm-4"></span>
            </div>
            <div id="group-submit" class="form-group">
                <div class="col-sm-offset-2 col-sm-3">
                    <button id="submit-button" class="btn btn-primary btn-block" type="submit" disabled>ADD USER</button>
                </div>
                 <span class="help-block col-sm-7"><noscript>You have to enable javascript in your browser to use this form.</noscript></span>
            </div>
        </form>
      </div>
    </div>
</div>
