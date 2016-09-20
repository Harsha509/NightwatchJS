/**
 * Created by Admin on 03/10/2016.
 */
var xml2js = require('./xml2js');
var fs= require('fs');
var mkdirp=require('./mkdirp');
var parser = new xml2js.Parser();
var jade = require('./jade');
var fsExtra=require('./fs-extra');

var now = new Date();
var summary = {
    x:1,
    totalTests:0,
    totalSuccess:0,
    totalFailures:0,
    totalSkipped:0,
    numTests: 0,
    suiteCount:0,
    numFailures: 0,
    numSuccess: 0,
    summaryReportGenDateTime: now.toLocaleString(),
    suites: []
};

var jadeTemplateIndexHtml = "doctype html\n" +
    "html(lang='en')\n" +
    "  head\n" +
    "    meta(charset='utf-8')\n" +
    "    meta(http-equiv='X-UA-Compatible', content='IE=edge')\n" +
    "    meta(name='viewport', content='width=device-width, initial-scale=1')\n" +
    "    title Test Report\n" +
    "    link(rel='stylesheet', href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css')\n" +
    "    script(type='text/javascript', src='https://www.google.com/jsapi')\n" +
    "    script(type='text/javascript').\n" +
    "      google.load('visualization', '1', {packages:['corechart']});\n" +
    "      google.setOnLoadCallback(drawSummaryChart);\n" +
    "      function drawSummaryChart() {\n" +
    "        var data = google.visualization.arrayToDataTable([\n" +
    "          ['Result', 'Number of Tests'],\n" +
    "          ['Success', #{totalSuccess}],\n" +
    "          ['Failure', #{totalFailures}],\n" +
    "          ['Skipped', #{totalSkipped}],\n" +
    "        ]);\n" +
    "        var options = {\n" +
    "          'chartArea': {'width': '90%', 'height': '90%'},\n" +
    "          'legend': 'none',\n" +
    "          colors: ['#4ca64c', '#C94322', '#ffffcc']\n" +
    "        };\n" +
    "        var chart = new google.visualization.PieChart(document.getElementById('summaryPieChart'));\n" +
    "        chart.draw(data, options);\n" +
    "      }\n" +
    "\n" +
    "  body\n" +
    "    div.jumbotron(style='height:60px;')\n" +
    "       .logo\n" +
    "        a(style='display:inline' href='http://www.zenq.com ' margin-top: '3px'  target='_blank')\n"+
    "         img(src='http://zenq.com/Portals/0/logo.png',align='left', width='10%', height='10%')\n"+
    "       .header\n" +
    "        h2(align='center', style='margin-top: 5px;') Automation Result Summary\n" +
    "     div.container\n" +
    "         .summary \n"+
    "           p \n" +
    "           b   \n "+
    "            | This report summarizes a series of automated Nightwatch.js test suites.  This report was generated  \n" +
    "            span= summaryReportGenDateTime\n" +
    "            | .\n" +
    "         .viewlog(style='text-align: right;') \n"+
    "          b    \n "+
    "          a(class='button',href='../../../logs/logFile.log',target='_blank') View LogOutput\n"+
    "    div.container\n" +
    "      div.row(style='text-align: right;')\n" +
    "        div#summaryPieChart(style='width: 250px; height: 250px; display: inline-block; margin-left: auto; margin-right: 450px;')\n" +
    "    div.container\n" +
    "      div.row\n" +
    "        div.col-md-3\n" +
    "          h3 Test Suites\n" +
    "          p \n" +
    "            | A total of \n" +
    "            span= totalTests\n" +
    "            |  test suites were executed.\n" +
    "        div.col-md-3\n" +
    "          h3 Success\n" +
    "          p\n" +
    "            span= totalSuccess\n" +
    "            |  of those test suites were successful. \n" +
    "        div.col-md-3\n" +
    "          h3 Failures\n" +
    "          p\n" +
    "            span= totalFailures\n" +
    "            |  of those test suites failed.\n" +
    "        div.col-md-3\n" +
    "          h3 Skipped\n" +
    "          p\n" +
    "            span= totalSkipped\n" +
    "            |  of those test skipped.\n" +
    "    div.container(style='margin-top: 20px;')\n" +
    "        div.page-header\n" +
    "            h1 Test Suites\n" +
    "        - each suite in suites\n" +
    "            div(class=(suite.numErrors < 1 && suite.numFailures < 1 && suite.numSkipped < 1) ? 'panel panel-success' : 'panel panel-danger')\n" +
    "                div.panel-heading\n" +
    "                    h1.panel-title='Suite'+'-'+suite.count+' : '+suite.name +' - '+'Summary'\n" +
    "                div.panel-body\n" +
    "                    div.row\n" +
    "                        div.col-md-4(style='font-weight: bold;')  Browser\n" +
    "                        div.col-md-8= suite.browserName\n" +
    "                    div.row\n" +
    "                        div.col-md-4(style='font-weight: bold;') Test Cases\n" +
    "                        div.col-md-8= suite.numTests\n" +
    "                    div.row\n" +
    "                        div.col-md-4(style='font-weight: bold;') Test Cases with Failures \n" +
    "                        div.col-md-8= suite.numFailures\n" +
    "                    div.row\n" +
    "                        div.col-md-4(style='font-weight: bold;') Test Cases with Errors \n" +
    "                        div.col-md-8= suite.numErrors\n" +
    "                    div.row\n" +
    "                        div.col-md-4(style='font-weight: bold;') Test Cases Skipped \n" +
    "                        div.col-md-8= suite.numSkipped\n" +
    "                    div.row\n" +
    "                        div.col-md-4(style='font-weight: bold;') Run Time\n" +
    "                        div.col-md-8\n" +
    "                            span= suite.executionTime\n" +
    "                            | s\n" +
    "                    div.row\n" +
    "                        div.col-md-4(style='font-weight: bold;') Timestamp\n" +
    "                        div.col-md-8= suite.timestamp\n" +
    "                    h3 Test Cases\n" +
    "                    - each testcase in suite.cases\n" +
    "                        div(class=(testcase.numFailures < 1 && testcase.numSkipped < 1) ? 'panel panel-success' : 'panel panel-danger')\n" +
    "                            div.panel-heading\n" +
    "                                h3.panel-title=testcase.name\n" +
    "                            div.panel-body\n" +
    "                                div.row\n" +
    "                                    div.col-md-4(style='font-weight: bold;') Assertions\n" +
    "                                    div.col-md-8= testcase.numAssertions\n" +
    "                                div.row\n" +
    "                                    div.col-md-4(style='font-weight: bold;') Assertions Failed\n" +
    "                                    div.col-md-8= testcase.numFailures\n" +
    "                                div.row\n" +
    "                                    div.col-md-4(style='font-weight: bold;') Assertions Skipped\n" +
    "                                    div.col-md-8= testcase.numSkipped\n" +
    "                                div.row\n" +
    "                                    div.col-md-4(style='font-weight: bold;') Run Time\n" +
    "                                    div.col-md-8\n" +
    "                                        span= testcase.executionTime\n" +
    "                                        | s\n" +
    "                                - if (testcase.failures.length > 0)\n" +
    "                                    h4 Failed Assertions\n" +
    "                                    - each failure in testcase.failures\n" +
    "                                        div.panel.panel-danger\n" +
    "                                            div.panel-heading\n" +
    "                                                h3.panel-title Failed Assertion\n" +
    "                                                 div.link(align='right')\n"+
    "                                                  a(class='button',href=suite.screenshotUrl,target='_blank') View Screenshot\n"+
    "                                            div.panel-body\n" +
    "                                                -if (failure.message && failure.message.message && failure.message.message.length > 0)\n" +
    "                                                    div.well.well-lg= failure.message.message\n" +
    "                                                -else\n" +
    "                                                    div.well.well-lg No failure message was provided.\n" +
    "                                                -if (failure.details && failure.details.length > 0)\n" +
    "                                                    pre.pre-scrollable= failure.details\n" +
    "\n" +
    "    script(src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js')\n" +
    "    script(src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js')"

var backup=function(){

    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "Aug";
    month[8] = "Sept";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";

    var date = new Date();
    var day = date.getDate();
    var monthString = month[date.getMonth()];
    var year = date.getFullYear();
    var hours=date.getHours();
    var min= date.getMinutes();
    var backup_dir="././reports/backupReport"+"_"+day+"-"+(monthString)+"-"+year+"_"+hours+"_"+min;
    var screenshots=backup_dir+'/screenshots';
    var htmlreports=backup_dir+'/htmlreports';
    mkdirp(backup_dir,function(err){
        if(err)
            console.log(err);
        else {
            if(fs.existsSync("././reports/recent_reports/screenshots")) {
                mkdirp(screenshots, function (err) {
                    if (err)
                        console.log('');
                });
            }
            else{
                console.log("**All Tests are passed, No Screenshots generated**")
            }
            mkdirp(htmlreports, function (err) {
                if (err)
                    console.log(err);
            });
        }
    });
    setTimeout(function(){
        if(fs.existsSync(backup_dir)) {
            fsExtra.copy("././reports/recent_reports/htmlreports",htmlreports,function(err){
                if(err)
                    return console.log(err);

                console.log("Html report backup success")
            });
        }
        if(fs.existsSync(backup_dir)) {
            fsExtra.copy("././reports/recent_reports/screenshots",screenshots,function(err){
                if(err)
                    console.log("**All Tests are passed, No Screenshots available**");
                else
                    console.log("screenshots backup success")
            });
        }
    });
};

var p="././reports/recent_reports/xmlfiles";
var x=0;
fs.readdir(p,function(err,files ){
    if(err)
        console.log("No xml files generated");
    else {
        backup();
        files.forEach(function (file) {
            var xml = fs.readFileSync("././reports/recent_reports/xmlfiles/" + file, {encoding: 'utf-8'});// reading xml files
            var parsingSuccess = true;
            parser.parseString(xml, function (err, json) {
                if (err) {
                    console.log("An error occured while processing test suite report: " + err);
                    parsingSuccess = false;
                    return;
                }
                var testsuites = json.testsuites;
                var suiteSummary = testsuites.$;
                summary.numTests++;
                if ((suiteSummary.failures && Number(suiteSummary.failures)) > 0 || (suiteSummary.errors && Number(suiteSummary.errors))) {
                    summary.numFailures++;
                }
                else
                    summary.numSuccess++;
                var testsuiteArray = testsuites.testsuite;
                for (var i = 0; i < testsuiteArray.length; i++) {
                    var testsuite = testsuiteArray[i].$;
                    var suiteName = testsuite.name;
                    var suite = {
                        browserName: file.split('_')[0],
                        screenshotUrl: '',
                        totlTests:'',
                        name: suiteName,
                        count: summary.x++,
                        numTests: Number(testsuite.tests),
                        numSkipped: Number(testsuite.skipped),
                        numFailures: Number(testsuite.failures),
                        numErrors: Number(testsuite.errors),
                        package: testsuite.package,
                        executionTime: Number(testsuite.time),
                        timestamp: testsuite.timestamp,
                        cases: []
                    };
                    summary.totalTests=(summary.totalTests)+(suite.numTests);
                    summary.totalFailures=(summary.totalFailures)+(suite.numFailures);
                    summary.totalSkipped=(summary.totalSkipped)+(suite.numSkipped);
                    summary.totalSuccess=(summary.totalTests)-((summary.totalFailures)+( summary.totalSkipped));

                    //console.log( summary.totalTests+ 'totalTests  ********************************' );
                    //console.log( summary.totalFailures+ 'totalFailures  ********************************' );
                    //console.log( summary.totalSkipped+ 'totalSkipped  ********************************' );

                    var testcaseArray = testsuiteArray[i].testcase;
                    for (var x = 0; x <= testcaseArray.length; x++) {
                        if (!testcaseArray[x])
                            continue;
                        var testcase = testcaseArray[x].$;
                        if (!testcase)
                            continue;
                        var failureArray = testcaseArray[x].failure;
                        var skippedArray = testcaseArray[x].skipped;
                        var _case = {
                            name: testcase.name,
                            count: x + 1,
                            numFailures: 0,
                            failures: [],
                            numSkipped: 0,
                            skipped: []
                        };
                        if (testcase.time != undefined && testcase.time != null)
                            _case.executionTime = Number(testcase.time);
                        if (testcase.assertions != undefined && testcase.assertions != null)
                            _case.numAssertions = Number(testcase.assertions);
                        if (failureArray) {
                            for (var y = 0; y < failureArray.length; y++) {
                                _case.numFailures++;
                                var failure = failureArray[y];
                                if (!failure)
                                    continue;
                                var f = {
                                    message: failure.$,
                                    details: failure._
                                };
                                _case.failures.push(f);
                            }
                        }
                        var screenshotUrlPath = '././reports/recent_reports/screenshots/' + suite.browserName + '/' + suite.name + '/' + testcase.name + '.png';
                        if (fs.existsSync(screenshotUrlPath)) {
                            //console.log('Parallel execution mode');
                            suite.screenshotUrl = '../screenshots/' + suite.browserName + '/' + suite.name + '/' + testcase.name + '.png';
                        }
                        else {
                            // console.log('Linear execution mode');
                            suite.screenshotUrl = '../screenshots/' + suite.name + '/' + testcase.name + '.png';
                        }
                        if (skippedArray) {
                            for (var z = 0; z < skippedArray.length; z++) {
                                _case.numSkipped++;
                            }
                        }
                        suite.cases.push(_case);
                    }
                    summary.suites.push(suite);
                }
            });

            function writeTemplatedSummaryReports(summary) {
                if (!summary)
                    return;
                var jadeIndexOptions = {
                    "pretty": true
                };
                var indexFn = jade.compile(jadeTemplateIndexHtml, jadeIndexOptions);
                var indexHtml = indexFn(summary);
                mkdirp.sync("././reports/recent_reports/htmlreports");
                var indexHtmlPath = "././reports/recent_reports/htmlreports/final_report.html";
                fs.writeFileSync(indexHtmlPath, indexHtml);
                return indexHtmlPath;
            }

            var indexFile = writeTemplatedSummaryReports(summary);
            if (!indexFile || !fs.existsSync(indexFile)) {
                console.log("Unable to generate summary HTML report files.");

            } else {
                console.log("Summary HTML report has been generated and written to '" + indexFile + "'");
            }
        });
    }
});
