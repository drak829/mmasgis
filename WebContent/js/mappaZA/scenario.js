/**
 * STORE PER LO SCENARIO
 */

var numS = 1;
var store_scenario = Ext.create('Ext.data.ArrayStore', {
	// autoLoad: true,
	// autoSync: true,
	fields : [{
		name : 'scenario'
	}, {
		name : 'fid'
	}],
	data : myDataScenario,
	listeners : {
		// Attivazione dei comandi per le zone solo con scenari aperti
		datachanged : function() {
			var scenAp = this.getCount();
			zoneSel = Ext.getCmp('zoneSel');
	        if(scenAp > 0){
	        	if(typeof zoneSel != 'undefined'){
	        		if (!(zoneSel.isVisible())){
	        			addZone();
	        		}
	        		else{
	        			addZone();
	        		}
	        	}
	        }
	        else{
	        	if(typeof zoneSel != 'undefined'){
	        		if (zoneSel.isVisible()){
	        			resetZone();
	        		}
	        	}
	        }
	    }
	}
});

/**
 * GRID PANEL PER LO SCENARIO
 */

scenario = Ext.create('Ext.grid.Panel', {
	id : 'scenarioAp',
	title : 'Scenario: ',
	store : store_scenario,
	viewConfig : {
		deferEmptyText : false
	},
	emptyText : 'Nessuno scenario aperto',
	width : 250,
	dockedItems : [{
		xtype : 'toolbar',
		items : [{
			xtype : 'button',
			icon : 'img/add16x16.png',
			id : 'newScenario',
			handler : newScenario
		},{
			xtype : 'button',
			icon : 'img/open_small.png',
			id : 'openScenario'
		},{
			xtype : 'button',
			icon : 'img/save16x16.png',
			id : 'saveScenario'
		},{
			xtype : 'button',
			icon : 'img/modify_small.png',
			id : 'modifyScenario',
			handler : modScenario
		}]
		
	}],	
	
	columns : [{
		text : 'Scenario',
		flex : 1,
		dataIndex : 'scenario'
	}, {
		xtype : 'actioncolumn',
		width : 35,
		items : [{
			icon : 'img/del2.png',
			tooltip : 'Elimina questo scenario',
			handler : function() {
				askSave(function(){
					if(answ === 'cancel'){
						return;
					}
					else if(answ === 'no'){
						deleteScen();
					}
					else if(answ === 'yes'){
						// inserire funzione di salvataggio su file
						console.log('salvataggio eseguito');
						deleteScen();
					}
				});
			}
		}]
	}]

});

/**
 * FUNZIONE PER CREARE UN NUOVO SCENARIO
 */

function newScenario(){
	var scenAp = store_scenario.getCount();
	if(scenAp > 0){
		askSave(function(){
			if(answ === 'cancel'){
				return;
			}
			else if(answ === 'no'){
				var dataS = new Array('Scenario '+(numS++), '','');
				myDataScenario.pop();
				myDataScenario.push(dataS);
				Ext.getCmp('scenarioAp').getStore().loadData(myDataScenario, false);
				resetZone();
				addZone();
			}
			else if(answ === 'yes'){
				// inserire funzione di salvataggio su file
				console.log('salvataggio eseguito');
				var dataS = new Array('Scenario '+(numS++), '','');
				myDataScenario.pop();
				myDataScenario.push(dataS);
				Ext.getCmp('scenarioAp').getStore().loadData(myDataScenario, false);
				resetZone();
				addZone();
			}
		});
	}
	else{
		var dataS = new Array('Scenario '+(numS++), '','');
		myDataScenario.push(dataS);
		Ext.getCmp('scenarioAp').getStore().loadData(myDataScenario, false);
	}
}


/**
 * FUNZIONE PER AZZERARE LE ZONE DOPO LA CREAZIONE DI UN NUOVO SCENARIO
 */

function resetZone(){
	zoneSel.hide();
	panelZA.remove(zoneSel, false);
	store_zone_selected.removeAll();
	myDataZone = [];
	numZ = 1;
}


/**
 * FUNZIONE PER ATTIVARE I COMANDI PER LE ZONE
 */

function addZone(){
	panelZA.add(zoneSel);
	zoneSel.show();
}


/**
 * FUNZIONE PER ELIMINARE LO SCENARIO APERTO
 */

function deleteScen(){
	myDataScenario.pop();
	Ext.getCmp('scenarioAp').getStore().loadData(myDataScenario, false);
	resetZone();
}


/**
 * FUNZIONI PER MODIFICARE IL NOME DELLO SCENARIO
 */

function modScenario(){
	modScen(doModScen);
}

function modScen(callback){
	Ext.Msg.show({
		title : 'Modifica scenario',
		msg : 'Specifica il nuovo nome:',
		buttons : Ext.Msg.OKCANCEL,
		buttonText: {ok: 'Fatto', cancel: 'Annulla'},
		prompt  : { maxlength : 30, autocapitalize : false },
		value : myDataScenario[0][0],
		fn : function(btn, text){
			if (btn === 'ok'){
	    	 	callback(text);
			}
			else if(btn === 'cancel'){
				return;
			}
		}
	});
}

function doModScen(text){
	var nome = text;
	var dataS = new Array(nome, '','');
	myDataScenario.pop();
	myDataScenario.push(dataS);
	Ext.getCmp('scenarioAp').getStore().loadData(myDataScenario, false);
}