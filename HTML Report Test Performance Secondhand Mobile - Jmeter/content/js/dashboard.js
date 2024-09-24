/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 86.09062170706007, "KoPercent": 13.909378292939937};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.30800842992623817, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2403846153846154, 500, 1500, "Seller Get Product "], "isController": false}, {"data": [0.34156820622986034, 500, 1500, "Buyer  Get  Product"], "isController": false}, {"data": [0.3452127659574468, 500, 1500, "Registration"], "isController": false}, {"data": [0.018018018018018018, 500, 1500, "Seller  Create Product"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "Buyer  Get Order"], "isController": false}, {"data": [0.010948905109489052, 500, 1500, "Seller  Delete  product"], "isController": false}, {"data": [0.5719656283566058, 500, 1500, "Buyer  Get  Product by ID"], "isController": false}, {"data": [0.27976190476190477, 500, 1500, "Buyer  Get Order by ID"], "isController": false}, {"data": [0.0075528700906344415, 500, 1500, "Buyer  Create Order"], "isController": false}, {"data": [0.08071505958829903, 500, 1500, "Buyer  Update  order"], "isController": false}, {"data": [0.5191458026509573, 500, 1500, "Login"], "isController": false}, {"data": [0.25187566988210075, 500, 1500, "Seller Get Product by id"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9490, 1320, 13.909378292939937, 2049.14541622761, 81, 20537, 1128.5, 5042.0, 6767.349999999997, 10723.18, 1.3001900414759253, 1.833680101341525, 0.9857021867100301], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Seller Get Product ", 936, 136, 14.52991452991453, 2398.0598290598323, 173, 17337, 1318.0, 5922.300000000001, 6983.15, 9073.279999999999, 0.21932023847795504, 0.4625419034776551, 0.07448106731514538], "isController": false}, {"data": ["Buyer  Get  Product", 931, 0, 0.0, 1877.9709989258868, 200, 11159, 1093.0, 4265.200000000001, 5545.0, 7436.4, 0.21809719451107223, 0.3842259168925531, 0.08283742063522741], "isController": false}, {"data": ["Registration", 940, 2, 0.2127659574468085, 2059.7765957446804, 426, 12053, 1184.0, 4900.199999999999, 6001.849999999999, 9296.460000000003, 0.22043482410590814, 0.13338212212605166, 0.12989660639415762], "isController": false}, {"data": ["Seller  Create Product", 222, 213, 95.94594594594595, 1419.9279279279283, 287, 10723, 940.0, 2920.1000000000013, 4654.25, 6600.220000000003, 0.05443961163467686, 0.018730379822963363, 0.5708069720651225], "isController": false}, {"data": ["Buyer  Get Order", 924, 124, 13.41991341991342, 2197.2175324675327, 203, 19367, 1202.0, 4946.0, 5855.5, 8401.0, 0.21647278217894847, 1.2292389969186597, 0.07317981444018709], "isController": false}, {"data": ["Seller  Delete  product", 137, 133, 97.08029197080292, 1420.905109489051, 270, 7000, 871.0, 4030.8, 5246.5999999999985, 6803.920000000002, 0.033627991449162696, 0.01196280894489845, 0.32064431753218653], "isController": false}, {"data": ["Buyer  Get  Product by ID", 931, 3, 0.322234156820623, 1023.3168635875403, 114, 8409, 628.0, 2438.6000000000035, 3016.199999999999, 5510.5599999999995, 0.2181004133365943, 0.18587209110623526, 0.07537465949629346], "isController": false}, {"data": ["Buyer  Get Order by ID", 924, 124, 13.41991341991342, 1988.0584415584408, 81, 9958, 1055.5, 4742.0, 5695.75, 7722.75, 0.21647572367670428, 0.2309778144304029, 0.07437577964352726], "isController": false}, {"data": ["Buyer  Create Order", 331, 327, 98.79154078549848, 2911.483383685802, 222, 14260, 1401.0, 7765.200000000001, 9109.399999999994, 12519.520000000004, 0.08127545996753892, 0.029996319124042065, 0.03256782955848518], "isController": false}, {"data": ["Buyer  Update  order", 923, 123, 13.326110509209101, 3766.803900325028, 160, 20537, 1948.0, 9812.800000000001, 11742.599999999997, 14483.839999999997, 0.21624068267394372, 0.13339103680613215, 0.08404804432207727], "isController": false}, {"data": ["Login", 1358, 2, 0.14727540500736377, 1135.736377025036, 178, 10176, 763.0, 2583.1000000000013, 3683.8499999999985, 5327.82, 0.18616730326379524, 0.09451639572903692, 0.07790649782322716], "isController": false}, {"data": ["Seller Get Product by id", 933, 133, 14.255091103965702, 2362.961414790997, 204, 12995, 1280.0, 5729.200000000001, 6846.799999999996, 10194.879999999994, 0.21857682823234834, 0.15663766711873572, 0.07588710594674222], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 276, 20.90909090909091, 2.9083245521601686], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 20, 1.5151515151515151, 0.2107481559536354], "isController": false}, {"data": ["403/Forbidden", 1024, 77.57575757575758, 10.790305584826132], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9490, 1320, "403/Forbidden", 1024, "400/Bad Request", 276, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 20, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Seller Get Product ", 936, 136, "403/Forbidden", 133, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration", 940, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Seller  Create Product", 222, 213, "403/Forbidden", 136, "400/Bad Request", 77, "", "", "", "", "", ""], "isController": false}, {"data": ["Buyer  Get Order", 924, 124, "403/Forbidden", 124, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Seller  Delete  product", 137, 133, "403/Forbidden", 132, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Buyer  Get  Product by ID", 931, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Buyer  Get Order by ID", 924, 124, "403/Forbidden", 123, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Buyer  Create Order", 331, 327, "400/Bad Request", 199, "403/Forbidden", 124, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", ""], "isController": false}, {"data": ["Buyer  Update  order", 923, 123, "403/Forbidden", 120, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["Login", 1358, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Seller Get Product by id", 933, 133, "403/Forbidden", 132, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
