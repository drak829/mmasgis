Ext.override(Ext.data.proxy.Ajax, {
	timeout : 270000
});

Ext.onReady(function() {

	Ext.QuickTips.init();

	Ext.define('ServicesModel', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'servizio',
			type : 'string'
		}, {
			name : 'num_pv',
			type : 'real'
		}, {
			name : 'numerica',
			type : 'real'
		}, {
			name : 'pot_pv',
			type : 'real'
		}, {
			name : 'ponderata',
			type : 'real'
		}, {
			name : 'pot_servizio',
			type : 'real'
		}, {
			name : 'ind_servizio',
			type : 'real'
		}, {
			name : 'eff_servizio',
			type : 'real'
		}, {
			name : 'eff_valore',
			type : 'real'
		}]
	});

	var servicesToolbar = Ext.create('Ext.toolbar.Toolbar', {
		height : 60,
		id : 'servicesToolbar',
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
			id : 'expStatSerBtn',
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
			id : 'base_pot',
			fieldLabel : 'Base Potenziale ',
			readOnly : true
		}]
	});

	servicesStore = Ext.create('Ext.data.Store', {
		remoteSort : true,
		model : 'ServicesModel',
		listeners : {
			load : function(store) {

				// Ext.getCmp('numRow').setText("Numero Anagrafiche: " +
				// store.getCount());
				Ext.getCmp('grigliaAnalisiServizi').setLoading(false);
				//console.debug(servicesGrid.store.getProxy().getReader().rawData.base_num);

				Ext.getCmp('base_num').setValue(servicesGrid.store.getProxy().getReader().rawData.base_num);
				Ext.getCmp('base_pot').setValue(servicesGrid.store.getProxy().getReader().rawData.base_pot);
			}
		},
		reader : {
			type : 'json',
			root : 'selections',
			successProperty : 'success',
			id : 'id'
		},
		proxy : {
			type : 'ajax',
			// idProperty: 'pv_id',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				// totalProperty: 'total',
				id : 'id'
			},
			actionMethods : {
				create : 'POST',
				read : 'POST',
				update : 'POST',
				destroy : 'POST'
			},
			extraParams : {
				// selections: selection_string,
				task : 'servicesAnalysis',
				censimento : dbname,
				classe : classId,
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

	servicesGrid = Ext.create('Ext.grid.Panel', {
		frame : true,
		layout : 'fit',
		title : 'Analisi Servizi: ' + dbname + ' -> ' + className,
		id : 'grigliaAnalisiServizi',
		store : servicesStore,
		selType : 'cellmodel',
		tbar : servicesToolbar,
		emptyText : 'Nessun record presente',
		columns : [{
			dataIndex : 'base_num',
			name : 'base_num',
			text : 'Base_num',
			hidden : true
		}, {
			dataIndex : 'base_pot',
			text : 'Base_pot',
			hidden : true
		}, {
			dataIndex : 'servizio',
			flex : 1.8,
			text : className
		}, {
			dataIndex : 'num_pv',
			flex : 1,
			text : "Numerosita' PV"
		}, {
			dataIndex : 'numerica',
			flex : 1,
			text : 'Numerica di servizio %'
		}, {
			dataIndex : 'pot_pv',
			flex : 1,
			text : "Potenzialita' PV"
		}, {
			dataIndex : 'ponderata',
			flex : 1,
			text : 'Ponderata %'
		}, {
			dataIndex : 'pot_servizio',
			flex : 1,
			text : 'Potenziale di servizio'
		}, {
			dataIndex : 'ind_servizio',
			flex : 1,
			text : 'Indice di servizio %'
		}, {
			dataIndex : 'eff_servizio',
			flex : 1,
			text : 'Efficienza servizio'
		}, {
			dataIndex : 'eff_valore',
			flex : 1,
			text : 'Efficienza valore'
		}]
	});

	new Ext.Viewport({
		frame : true,
		layout : 'fit',
		items : [servicesGrid],
		listeners : {
			afterrender : function(item) {
				checkAuth('statSer');
			}
		}
	});

	Ext.getCmp('grigliaAnalisiServizi').setLoading('Caricamento Analisi Servizi');
	servicesStore.load();

});
function excelExport() {

	data = new Array();
	for (i in servicesGrid.getStore().data.items) {
		data[i] = servicesGrid.getStore().data.items[i].data;
		// console.debug(data[i]);

	}
	encodedData = Ext.JSON.encode(data);
	// console.debug(encodedData);
	var form = document.getElementById('estrazioni');
	form.action = 'http://' + constants.ip + constants.root + constants.servlet;
	form.task.value = 'exportStat';
	form.censimento.value = dbname;
	form.selections.value = encodedData;
	form.header.value = getExcelHeader('grigliaAnalisiServizi');
	form.submit();
}
function getExcelHeader(cmp) {

	store = Ext.getCmp(cmp);

	arr = new Array();
	dataOutput = new Array();
	dataOutputMar = new Array();

	for (n in store.columns) {
		// if (!store.columns[n].hidden) {
		arr.push(store.columns[n].dataIndex);
		// }

	}
	dataOutput = arr.slice(2, 12);
	// dataOutput[0] = className;
	// dataOutputMar.push(className)
	// dataOutputMar.concat(className);
	// dataOutputMar.push(dataOutput);

	encodedHeader = Ext.JSON.encode(dataOutput);
	// console.debug(encodedHeader);
	return encodedHeader;
}
