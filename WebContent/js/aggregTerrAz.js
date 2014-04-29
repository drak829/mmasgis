//Ext.override(Ext.data.proxy.Ajax, { timeout:270000 });
Ext.require(['Ext.data.*', 'Ext.grid.*']);

Ext.define('Pot', {
	extend : 'Ext.data.Model',
	fields : []
});
var hide = true;
var intestazione;
var primaColonna;
Ext.onReady(function() {

	Ext.QuickTips.init();

	Ext.define('AggTerAzModel', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'Territorio',
			type : 'string'
		},{
			name : 'CAP',
			type : 'integer'
		}, {
			name : 'NumPV',
			type : 'real'
		}, {
			name : 'Percentuale_PV',
			type : 'real'
		}, {
			name : 'NumClienti',
			type : 'real'
		}, {
			name : 'Percentuale_Clienti',
			type : 'real'
		}, {
			name : 'Potenziale',
			type : 'real'
		}, {
			name : 'Percentuale_Pot',
			type : 'real'
		}],
		idProperty : 'cap'
	});
	var terrAzToolbar = Ext.create('Ext.toolbar.Toolbar', {
		height : 60,
		id : 'terrAzToolbar',
		items : [{
			xtype : 'box',
			autoEl : {
				tag : 'img',
				src : 'img/logo_mmas.png'
			},
			id : 'mmas',
			width : 110,
			height : 50
		}, '-', {
			id : 'expStatPvAzBtn',
			// text: 'Esporta statistiche',
			icon : 'img/expView.png',
			width : 50,
			height : 50,
			scale : 'medium',
			tooltip : 'esporta il risultato in formato excel',
			handler : function() {

				excelExport();
			}
		}, {
			xtype : 'textfield',
			id : 'base_num',
			fieldLabel : 'Base Numerica ',
			readOnly : true
		}, {
			xtype : 'textfield',
			id : 'base_cl',
			fieldLabel : 'Base Clienti ',
			readOnly : true
		}, {
			xtype : 'textfield',
			id : 'base_pot',
			fieldLabel : 'Totale Potenziali ',
			readOnly : true
		}]
	});

	aggTerStoreAz = Ext.create('Ext.data.Store', {
		remoteSort : true,
		model : 'AggTerAzModel',
		listeners : {
			load : function(store) {

				// Ext.getCmp('numRow').setText("Numero Anagrafiche: " +
				// store.getCount());
				Ext.getCmp('grigliaAggregazioneTerrAz').setLoading(false);

				Ext.getCmp('base_num').setValue(aggTerGridAz.store.getProxy().getReader().rawData.base_num);
				// console.debug(brandsGrid.store.getProxy().getReader().rawData.base_num);
				Ext.getCmp('base_cl').setValue(aggTerGridAz.store.getProxy().getReader().rawData.base_cl);
				Ext.getCmp('base_pot').setValue(aggTerGridAz.store.getProxy().getReader().rawData.base_pot);
			}
		}/*
			 * , reader: { type: 'json', root: 'selections', successProperty:
			 * 'success', id: 'cap' }
			 */,
		proxy : {
			type : 'ajax',
			// idProperty: 'pv_id',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				// totalProperty: 'total',
				id : 'cap'
			},
			actionMethods : {
				create : 'POST',
				read : 'POST',
				update : 'POST',
				destroy : 'POST'
			},
			extraParams : {
				// selections: selection_string,
				task : 'aggTerAz',
				censimento : dbname,
				classe : classe,
				layer : layer,
				reg : reg,
				pro : pro,
				com : com,
				cap : cap,
				parametri : parametri,
				potenziali : potenziali,
				marche : marche
			}
		}
	});

	if (layer == 'cap') {
		hide = false;
		intestazione = 'Aree CAP e Comuni';
		primaColonna = 'Comune';
	}
	else {
		intestazione = layer;
		primaColonna = layer;
	}

	aggTerGridAz = Ext.create('Ext.grid.Panel', {
		frame : true,
		layout : 'fit',
		title : 'Analisi distribuzione pvAz: ' + dbname + ' -> ' + intestazione,
		id : 'grigliaAggregazioneTerrAz',
		store : aggTerStoreAz,
		selType : 'cellmodel',
		tbar : terrAzToolbar,
		emptyText : 'Nessun record presente',
		columns : [{
			dataIndex : 'base_num',
			name : 'base_num',
			text : 'base_num',
			hidden : true
		}, {
			dataIndex : 'base_cl',
			text : 'base_cl',
			hidden : true
		}, {
			dataIndex : 'base_pot',
			text : 'base_pot',
			hidden : true
		}, {
			dataIndex : 'Territorio',
			text : primaColonna,
			flex : 1
		},
		   {
			dataIndex: 'CAP',
			text: 'CAP',
			flex : 0.3
		}, {
			dataIndex : 'NumPV',
			text : 'Numero PV',
			flex : 0.5
		}, {
			dataIndex : 'Percentuale_PV',
			flex : 1,
			text : "% PV"
		}, {
			dataIndex : 'NumClienti',
			flex : 1,
			text : "Numero clienti"
		}, {
			dataIndex : 'Percentuale_Clienti',
			flex : 1,
			text : "% clienti"
		}, {
			dataIndex : 'Potenziale',
			flex : 1,
			text : "Potenziale"
		}, {
			dataIndex : 'Percentuale_Pot',
			flex : 1,
			text : "% Potenziale"
		}]
	});

	new Ext.Viewport({
		frame : true,
		layout : 'fit',
		items : [aggTerGridAz],
		listeners : {
			afterrender : function(item) {

				checkAuth('statPvAz');
			}
		}
	});

	Ext.getCmp('grigliaAggregazioneTerrAz').setLoading('Caricamento Aggregazione Territoriale Azienda');
	aggTerStoreAz.load();
	//console.log(aggTerStore);

});
function excelExport() {

	data = new Array();
	for (i in aggTerGridAz.getStore().data.items) {
		data[i] = aggTerGridAz.getStore().data.items[i].data;
		// console.debug(data[i]);

	}
	encodedData = Ext.JSON.encode(data);
	// console.debug(encodedData);
	var form = document.getElementById('estrazioni');
	form.action = 'http://' + constants.ip + constants.root + constants.servlet;
	form.task.value = 'exportStat';
	form.censimento.value = dbname;
	form.selections.value = encodedData;
	form.header.value = getExcelHeader('grigliaAggregazioneTerrAz');
	form.submit();
}
function getExcelHeader(cmp) {

	store = Ext.getCmp(cmp);

	arr = new Array();
	dataOutput = new Array();
	for (n in store.columns) {
		// if (!store.columns[n].hidden) {
		arr.push(store.columns[n].dataIndex);
		// }
	}
	dataOutput = arr.slice(3, 12);

	encodedHeader = Ext.JSON.encode(dataOutput);
	// console.debug(encodedHeader);
	return encodedHeader;
}
