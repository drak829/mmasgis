/**
 * STORE PER LE ZONE
 */

var numZ = 1;
var store_zone_selected = Ext.create('Ext.data.ArrayStore', {
	// autoLoad: true,
	// autoSync: true,
	fields : [{
		name : 'zona'
	}, {
		name : 'fid'
	}, {
		name : 'agente'
	}, {
		name : 'space'
	}],
	data : myDataZone
});


/**
 * GRID PANEL PER LE ZONE
 */

zone = Ext.create('Ext.grid.Panel', {
	id : 'zoneSel',
	title : 'Zone definite: ',
	store : store_zone_selected,
	viewConfig : {
		deferEmptyText : false
	},
	emptyText : 'Nessuna zona definita',
	width : 250,
	flex : 1,
	dockedItems : [{
		xtype : 'toolbar',
		items : [{
			xtype : 'button',
			icon : 'img/add16x16.png',
			id : 'newZone',
			handler : newZone,
		},{
			xtype : 'button',
			icon : 'img/open_small.png',
			id : 'openZone',
		},{
			xtype : 'button',
			icon : 'img/save16x16.png',
			id : 'saveZone',
		},{
			xtype : 'button',
			icon : 'img/modify_small.png',
			id : 'modifyZone',
		},{
			xtype : 'button',
			icon : 'img/search_small.png',
			id : 'searchZone',
		},{
			xtype : 'tbfill',
		},{
			xtype : 'button',
			icon : 'img/ass_small.png',
			id : 'assZone',
			
		}]
		
	}],	
	
	columns : {
		items : [{
			text : 'Zona',
			flex : 0.6,
			dataIndex : 'zona'
		}, {
			text : 'Agente',
			flex : 1,
			dataIndex : 'agente'
		}, {
			text: '',
			flex : 0.2,
			dataIndex : 'space'
		}]
	}

});

/**
 * FUNZIONE PER CREARE NUOVE ZONE
 */

function newZone() {
	
	var data = new Array('zona'+(numZ++), '','NoAgente');
	myDataZone.push(data);
	Ext.getCmp('zoneSel').getStore().loadData(myDataZone, false);
}