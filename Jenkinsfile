// To use Node.js from Jenkins Global Tool Configuration, uncomment below:
// tools {
//     nodejs 'Node Js'  // Use exact name from Jenkins Global Tool Configuration
// }
// And update environment PATH:
// environment {
//     GITHUB_TOKEN = credentials('github-token')
//     PATH = "${tool('Node Js')}/bin:${env.PATH}"
// }

pipeline {
    agent any

    parameters {
        string(name: 'TEST_TAG', defaultValue: '', description: 'Test tag to filter test cases (e.g., login)')
        string(name: 'PR_NUMBER', defaultValue: '', description: 'PR number for commenting results')
        string(name: 'PR_BRANCH', defaultValue: '', description: 'PR branch name')
        string(name: 'PR_URL', defaultValue: '', description: 'PR URL')
        string(name: 'PR_REPO', defaultValue: '', description: 'Repository name')
        string(name: 'PR_OWNER', defaultValue: '', description: 'Repository owner')
        string(name: 'TARGET_BRANCH', defaultValue: 'main', description: 'Target branch')
        string(name: 'NODE_PATH', defaultValue: '', description: 'Custom Node.js bin directory path (e.g., /Users/username/.nvm/versions/node/v20.19.6/bin). Leave empty for auto-detect.')
    }

    environment {
        GITHUB_TOKEN = credentials('github-token')
    }
    
    // Auto-detect Node.js paths on Mac
    // Common locations: Homebrew, nvm, system paths

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out Automation Test repository..."
                    echo "   PR Number: ${params.PR_NUMBER}"
                    echo "   PR URL: ${params.PR_URL}"
                    
                    // Extract repo info from PR URL if available
                    if (params.PR_URL && params.PR_URL.trim() != '') {
                        def repoInfo = extractRepoInfoFromPRUrl(params.PR_URL)
                        if (repoInfo) {
                            // Override PR_REPO and PR_OWNER parameters if extracted successfully
                            echo "   Extracted repo info from PR URL: ${repoInfo.owner}/${repoInfo.repo}"
                            echo "   Overriding PR_OWNER: ${params.PR_OWNER} → ${repoInfo.owner}"
                            echo "   Overriding PR_REPO: ${params.PR_REPO} → ${repoInfo.repo}"
                            // Note: We can't directly modify params, but we'll use repoInfo in comment function
                            env.PR_OWNER_OVERRIDE = repoInfo.owner
                            env.PR_REPO_OVERRIDE = repoInfo.repo
                        } else {
                            echo "   WARNING: Could not extract repo info from PR URL, using provided parameters"
                            env.PR_OWNER_OVERRIDE = params.PR_OWNER
                            env.PR_REPO_OVERRIDE = params.PR_REPO
                        }
                    } else {
                        echo "   WARNING: PR URL not provided, using parameters: ${params.PR_OWNER}/${params.PR_REPO}"
                        env.PR_OWNER_OVERRIDE = params.PR_OWNER
                        env.PR_REPO_OVERRIDE = params.PR_REPO
                    }
                }
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    echo "Setting up test environment..."
                    
                    // Use custom Node.js path if provided, otherwise auto-detect
                    def nodePath = null
                    if (params.NODE_PATH && params.NODE_PATH.trim() != '') {
                        nodePath = params.NODE_PATH.trim()
                        echo "Using custom Node.js path: ${nodePath}"
                    } else {
                        nodePath = findNodeJsOnMac()
                        if (nodePath) {
                            echo "Auto-detected Node.js at: ${nodePath}"
                        }
                    }
                    
                    if (nodePath) {
                        env.PATH = "${nodePath}:${env.PATH}"
                    }
                    
                    // Check if Node.js is available
                    def nodeVersion = sh(
                        script: 'node --version || echo "NOT_FOUND"',
                        returnStdout: true
                    ).trim()
                    
                    def npmVersion = sh(
                        script: 'npm --version || echo "NOT_FOUND"',
                        returnStdout: true
                    ).trim()
                    
                    if (nodeVersion == 'NOT_FOUND' || npmVersion == 'NOT_FOUND') {
                        error("""
                            ERROR: Node.js or npm not found!

                            Please ensure Node.js is installed on the Jenkins agent:
                            1. Install Node.js on the Jenkins agent machine, OR
                            2. Configure Node.js tool in Jenkins:
                            - Go to: Manage Jenkins → Global Tool Configuration
                            - Find "NodeJS" section
                            - Add Node.js installation with name matching your configuration
                            - Then uncomment the 'tools' block in Jenkinsfile

                            Current status:
                            - Node.js: ${nodeVersion}
                            - npm: ${npmVersion}
                        """)
                    }
                    
                    echo "Node.js version: ${nodeVersion}"
                    echo "npm version: ${npmVersion}"
                    
                    sh """
                        npm install
                        npx playwright install --with-deps || true
                    """
                }
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    // Determine test tag from PR_BRANCH or TEST_TAG parameter
                    def testTag = params.TEST_TAG ?: ''
                    if (!testTag && params.PR_BRANCH) {
                        // Extract tag from branch name (e.g., feat/login -> login)
                        def branchName = params.PR_BRANCH.toString()
                        def patterns = [
                            ~/^feat\/(.+)$/,
                            ~/^feature\/(.+)$/,
                            ~/^fix\/(.+)$/,
                            ~/^refactor\/(.+)$/
                        ]
                        for (pattern in patterns) {
                            def matcher = branchName =~ pattern
                            if (matcher) {
                                testTag = matcher[0][1].trim()
                                break
                            }
                        }
                    }
                    
                    // Build test command
                    def testCommand = 'CI=true npx playwright test'
                    
                    if (testTag && testTag.trim() != '') {
                        // Run tests with tag filter
                        testCommand += " --grep @${testTag}"
                        echo "Running tests with tag: @${testTag}"
                    } else {
                        // Fallback: run all tests or specific file
                    def testFilePath = 'tests/e2e/features/login/cases/case-02-button-login/test.spec.ts'
                        testCommand += " \"${testFilePath}\""
                    echo "Running test file: ${testFilePath}"
                    }
                    
                    testCommand += " --project=frontend-chromium --workers=4 --retries=1"
                    
                    // Create test-results and Allure results directories if they don't exist
                    sh """
                        mkdir -p test-results
                        mkdir -p tests/reports/allure/allure-results
                        mkdir -p tests/reports/playwright/playwright-report
                    """
                    
                    echo "Created directories for test results and reports"
                    
                    // Run tests - JSON reporter is configured in playwright.config.ts when CI=true
                    // Use catchError to ensure pipeline continues even if tests fail
                    // This allows us to parse results and comment to PR even when tests fail
                    def exitCode = 0
                    catchError(buildResult: null, stageResult: 'FAILURE') {
                        exitCode = sh(
                            script: testCommand,
                            returnStatus: true
                        )
                    }
                    
                    env.TEST_EXECUTION_EXIT_CODE = exitCode.toString()
                    
                    // Debug: Check if Allure results were generated after test execution
                    echo "Checking for Allure results after test execution..."
                    sh """
                        echo "Current directory: \$(pwd)"
                        echo "Checking for Allure results:"
                        ls -la tests/reports/allure/allure-results/ 2>/dev/null | head -20 || echo "Directory does not exist or is empty"
                        find tests/reports/allure/allure-results -type f 2>/dev/null | head -10 || echo "No files found"
                    """
                    
                    // Don't set build result here - will be set based on parsed results
                    echo "Test execution completed with exit code: ${exitCode}"
                }
            }
        }

        stage('Parse Test Results') {
            steps {
                script {
                    echo "Parsing test results..."
                    
                    // Check if JSON file exists
                    sh 'ls -la test-results/ || echo "test-results directory not found"'
                    sh 'find test-results -name "*.json" -type f 2>/dev/null | head -5 || echo "No JSON files found"'
                    
                    def testResults = parsePlaywrightResults()
                    
                    echo "Parsed Results:"
                    echo "   Total: ${testResults.total}"
                    echo "   Passed: ${testResults.passed}"
                    echo "   Failed: ${testResults.failed}"
                    echo "   Skipped: ${testResults.skipped}"
                    echo "   Test Cases Count: ${testResults.testCases?.size() ?: 0}"
                    
                    if (testResults.testCases && !testResults.testCases.isEmpty()) {
                        echo "Test Cases Found:"
                        testResults.testCases.eachWithIndex { test, index ->
                            echo "   ${index + 1}. ${test.title} - ${test.status}"
                        }
                    } else {
                        echo "WARNING: No test cases found in results"
                    }
                    
                    // Set build result based on test results
                    if (testResults.failed > 0) {
                        currentBuild.result = 'FAILURE'
                        echo "Build marked as FAILURE: ${testResults.failed} test(s) failed"
                    } else if (testResults.total > 0 && testResults.passed > 0) {
                        currentBuild.result = 'SUCCESS'
                        echo "Build marked as SUCCESS: All ${testResults.passed} test(s) passed"
                    } else if (testResults.total == 0) {
                        currentBuild.result = 'UNSTABLE'
                        echo "WARNING: Build marked as UNSTABLE: No tests executed"
                    }
                    
                    env.TEST_RESULTS_JSON = groovy.json.JsonOutput.toJson(testResults)
                    
                    // Only show failed tests
                    if (testResults.failed > 0 && testResults.testCases) {
                        echo "Failed Tests (${testResults.failed}):"
                        def failedTests = testResults.testCases.findAll { it.status == 'failed' }
                        failedTests.eachWithIndex { test, index ->
                            echo "   ${index + 1}. ${test.title}"
                            if (test.error) {
                                echo "      Error: ${test.error.take(200)}"
                            }
                        }
                    } else if (testResults.failed == 0 && testResults.total > 0) {
                        echo "All tests passed (${testResults.total} tests)"
                    } else {
                        echo "WARNING: No test results found"
                    }
                    
                    // Create test-results-summary.json for FE job to read
                    def summaryData = [
                        total: testResults.total ?: 0,
                        passed: testResults.passed ?: 0,
                        failed: testResults.failed ?: 0,
                        skipped: testResults.skipped ?: 0,
                        duration: testResults.duration ?: 0,
                        testCases: []
                    ]
                    
                    // Convert test cases to proper format
                    if (testResults.testCases && !testResults.testCases.isEmpty()) {
                        testResults.testCases.each { testCase ->
                            def testCaseData = [
                                title: testCase.title?.toString() ?: 'Unknown',
                                status: testCase.status?.toString() ?: 'unknown',
                                duration: testCase.duration ? (testCase.duration instanceof Number ? testCase.duration : testCase.duration.toString().toInteger()) : 0
                            ]
                            
                            if (testCase.error) {
                                testCaseData.error = testCase.error.toString()
                            }
                            
                            summaryData.testCases.add(testCaseData)
                        }
                    }
                    
                    // Write to file
                    def summaryJson = groovy.json.JsonOutput.prettyPrint(groovy.json.JsonOutput.toJson(summaryData))
                    writeFile file: 'test-results-summary.json', text: summaryJson
                }
            }
        }

        stage('Publish Allure Report') {
            steps {
                script {
                    echo "Publishing Allure Report..."
                    
                    try {
                        // Debug: List all directories to find Allure results
                        echo "Searching for Allure results..."
                        sh """
                            echo "Checking common Allure paths:"
                            ls -la tests/reports/ 2>/dev/null || echo "tests/reports/ does not exist"
                            ls -la tests/reports/allure/ 2>/dev/null || echo "tests/reports/allure/ does not exist"
                            ls -la allure-results/ 2>/dev/null || echo "allure-results/ does not exist"
                            find . -type d -name "*allure*" 2>/dev/null | head -10 || echo "No allure directories found"
                        """
                        
                        // Check multiple possible paths
                        def allurePaths = [
                            'tests/reports/allure/allure-results',
                            'allure-results',
                            'tests/reports/allure-results'
                        ]
                        
                        def foundPath = null
                        for (def path : allurePaths) {
                            if (fileExists(path)) {
                                echo "Found Allure results directory at: ${path}"
                                
                                // Count result files
                                def resultCount = sh(
                                    script: "find ${path} -name '*-result.json' -type f 2>/dev/null | wc -l | tr -d ' '",
                                    returnStdout: true
                                ).trim()
                                
                                def totalFiles = sh(
                                    script: "find ${path} -type f 2>/dev/null | wc -l | tr -d ' '",
                                    returnStdout: true
                                ).trim()
                                
                                echo "   Found ${resultCount} test result file(s)"
                                echo "   Total files in directory: ${totalFiles}"
                                
                                if (resultCount.toInteger() > 0 || totalFiles.toInteger() > 0) {
                                    foundPath = path
                                    break
                                }
                            }
                        }
                        
                        if (foundPath) {
                            echo "Publishing Allure report from: ${foundPath}"
                            
                            // Publish Allure report using Allure Plugin
                            allure([
                                includeProperties: false,
                                jdk: '',
                                properties: [],
                                reportBuildPolicy: 'ALWAYS',
                                results: [[path: foundPath]]
                            ])
                            
                            echo "Allure report published successfully"
                            echo "   View the report on the Jenkins build page"
                        } else {
                            echo "WARNING: Allure results directory not found in any expected location"
                            echo "   Searched paths:"
                            allurePaths.each { path ->
                                echo "     - ${path}"
                            }
                            echo "   Allure report will not be published"
                            echo "   Possible reasons:"
                            echo "   1. Allure reporter may not have generated results"
                            echo "   2. Tests may not have run (check previous stage logs)"
                            echo "   3. Allure reporter configuration may be incorrect"
                            echo "   Check playwright.config.ts to ensure Allure reporter is enabled"
                        }
                    } catch (Exception e) {
                        echo "WARNING: Failed to publish Allure report: ${e.getMessage()}"
                        echo "   Error class: ${e.getClass().name}"
                        echo "   Stack trace: ${e.getStackTrace().take(3).join('\n')}"
                        echo "   This may be because:"
                        echo "   1. Allure Plugin is not installed in Jenkins"
                        echo "   2. Allure Commandline Tool is not configured"
                        echo "   3. Allure results directory does not exist"
                        echo "   Build will continue..."
                    }
                }
            }
        }

        stage('Create GitHub Check') {
            when {
                expression { 
                    return false  // Disabled: FE job will create GitHub Checks using Warnings Plugin
                }
            }
            steps {
                script {
                    echo "INFO: GitHub Check creation is handled by FE job using Warnings Plugin"
                    echo "   This stage is disabled to avoid API authentication issues"
                }
            }
        }

        stage('Comment Results to PR') {
            when {
                expression { 
                    return params.PR_NUMBER && params.PR_REPO && params.PR_OWNER
                }
            }
            steps {
                script {
                    // Use catchError to ensure this stage always runs, even if previous stages failed
                    catchError(buildResult: null, stageResult: null) {
                        try {
                            // Parse test results directly from parsed results
                            def testResults = parsePlaywrightResults()
                            
                            // Convert to plain Map to avoid serialization issues
                            def testCasesList = []
                            if (testResults.testCases && !testResults.testCases.isEmpty()) {
                                testResults.testCases.each { testCase ->
                                    testCasesList.add([
                                        title: testCase.title?.toString() ?: 'Unknown',
                                        status: testCase.status?.toString() ?: 'unknown',
                                        duration: testCase.duration instanceof Number ? testCase.duration : (testCase.duration?.toString()?.toInteger() ?: 0),
                                        error: testCase.error?.toString()
                                    ])
                                }
                            }
                            
                            def resultsMap = [
                                total: testResults.total instanceof Number ? testResults.total : (testResults.total?.toString()?.toInteger() ?: 0),
                                passed: testResults.passed instanceof Number ? testResults.passed : (testResults.passed?.toString()?.toInteger() ?: 0),
                                failed: testResults.failed instanceof Number ? testResults.failed : (testResults.failed?.toString()?.toInteger() ?: 0),
                                skipped: testResults.skipped instanceof Number ? testResults.skipped : (testResults.skipped?.toString()?.toInteger() ?: 0),
                                duration: testResults.duration instanceof Number ? testResults.duration : (testResults.duration?.toString()?.toLong() ?: 0),
                                testCases: testCasesList
                            ]
                            
                            echo "   Prepared ${resultsMap.total} test cases for PR comment"
                            def commentSent = commentDetailedResultsToPR(resultsMap)
                            
                            // Store results for post block (backup in case stage fails)
                            if (commentSent) {
                                env.PR_COMMENT_SENT = 'true'
                            } else {
                                env.PR_COMMENT_SENT = 'false'
                                echo "WARNING: Comment was not sent successfully, will retry in post block"
                            }
                        } catch (Exception e) {
                            echo "ERROR: Error parsing test results for PR comment: ${e.getMessage()}"
                            echo "   Error class: ${e.getClass().name}"
                            echo "   Stack trace: ${e.getStackTrace().take(3).join('\n')}"
                            env.PR_COMMENT_SENT = 'false'
                            env.PR_COMMENT_ERROR = e.getMessage()
                            
                            // Re-throw to be caught by catchError, but don't fail the build
                            throw e
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Archive test results and reports
                archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                archiveArtifacts artifacts: 'test-results/junit.xml', allowEmptyArchive: true
                archiveArtifacts artifacts: 'test-results/results.json', allowEmptyArchive: true
                archiveArtifacts artifacts: 'tests/reports/**/*', allowEmptyArchive: true
                archiveArtifacts artifacts: 'test-results-summary.json', allowEmptyArchive: true
                
                // Archive Allure results (if generated)
                archiveArtifacts artifacts: 'tests/reports/allure/allure-results/**/*', allowEmptyArchive: true
                
                echo "Test reports archived. Access them from the build artifacts."
                echo "JUnit XML file archived for FE job to consume."
                echo "JSON results file archived for FE job to generate JUnit XML with full test names."
                echo "Allure results archived (if available)."
                echo "Allure report is available on the Jenkins build page (if Allure Plugin is installed)."
                
                // Uncomment below after installing HTML Publisher Plugin
                // try {
                //     publishHTML([
                //         reportDir: 'tests/reports/playwright/playwright-report',
                //         reportFiles: 'index.html',
                //         reportName: "Playwright Report - case-02-button-login",
                //         keepAll: true
                //     ])
                // } catch (Exception e) {
                //     echo "WARNING: Could not publish HTML report: ${e.getMessage()}"
                // }
                
                // Ensure PR comment is sent even if previous stage failed
                if (params.PR_NUMBER && params.PR_REPO && params.PR_OWNER) {
                    if (env.PR_COMMENT_SENT != 'true') {
                        echo "PR comment was not sent in stage, attempting to send now..."
                        try {
                            def testResults = parsePlaywrightResults()
                            
                            // Convert to plain Map to avoid serialization issues
                            def testCasesList = []
                            if (testResults.testCases && !testResults.testCases.isEmpty()) {
                                testResults.testCases.each { testCase ->
                                    testCasesList.add([
                                        title: testCase.title?.toString() ?: 'Unknown',
                                        status: testCase.status?.toString() ?: 'unknown',
                                        duration: testCase.duration instanceof Number ? testCase.duration : (testCase.duration?.toString()?.toInteger() ?: 0),
                                        error: testCase.error?.toString()
                                    ])
                                }
                            }
                            
                            def resultsMap = [
                                total: testResults.total instanceof Number ? testResults.total : (testResults.total?.toString()?.toInteger() ?: 0),
                                passed: testResults.passed instanceof Number ? testResults.passed : (testResults.passed?.toString()?.toInteger() ?: 0),
                                failed: testResults.failed instanceof Number ? testResults.failed : (testResults.failed?.toString()?.toInteger() ?: 0),
                                skipped: testResults.skipped instanceof Number ? testResults.skipped : (testResults.skipped?.toString()?.toInteger() ?: 0),
                                duration: testResults.duration instanceof Number ? testResults.duration : (testResults.duration?.toString()?.toLong() ?: 0),
                                testCases: testCasesList
                            ]
                            
                            echo "   Prepared ${resultsMap.total} test cases for PR comment (from post block)"
                            commentDetailedResultsToPR(resultsMap)
                            echo "PR comment sent successfully from post block"
                        } catch (Exception e) {
                            echo "ERROR: Failed to send PR comment from post block: ${e.getMessage()}"
                            echo "   This is a fallback attempt, error may have occurred earlier"
                        }
                    } else {
                        echo "PR comment was already sent in stage"
                    }
                }
            }
        }
    }
}

def parsePlaywrightResults() {
    def results = [
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0,
        testCases: []
    ]
    
    try {
        // Find JSON file in multiple locations
        def jsonFiles = [
            'test-results/results.json',  // File from JSON reporter
            'test-results.json',  // File at root (Playwright creates here)
            'playwright-report/test-results.json'
        ]
        
        def jsonFile = null
        for (def file : jsonFiles) {
            if (fileExists(file)) {
                jsonFile = file
                echo "Found JSON file at: ${file}"
                break
            }
        }
        
        if (!jsonFile) {
            // Find all possible JSON files in test-results
            def foundFiles = sh(
                script: 'find test-results -name "*.json" -type f 2>/dev/null | head -5',
                returnStdout: true
            ).trim()
            
            if (foundFiles) {
                echo "WARNING: Found potential JSON files in test-results:"
                echo foundFiles
                // Prioritize files with names containing "result" or "last-run"
                def files = foundFiles.split('\n')
                for (def file : files) {
                    if (file.contains('result') || file.contains('last-run')) {
                        jsonFile = file.trim()
                        echo "   Using: ${jsonFile}"
                        break
                    }
                }
                // If not found, use the first file
                if (!jsonFile && files.length > 0) {
                    jsonFile = files[0].trim()
                    echo "   Using first found file: ${jsonFile}"
                }
            }
        }
        
        if (jsonFile && fileExists(jsonFile)) {
            def jsonContent = readFile(jsonFile).trim()
            
            // Try to extract valid JSON if file contains noise
            // JSON should start with [ or {
            def jsonStart = jsonContent.indexOf('[')
            def jsonStartBrace = jsonContent.indexOf('{')
            
            if (jsonStart >= 0 || jsonStartBrace >= 0) {
                def actualStart = (jsonStart >= 0 && jsonStartBrace >= 0) ? 
                    Math.min(jsonStart, jsonStartBrace) : 
                    (jsonStart >= 0 ? jsonStart : jsonStartBrace)
                
                if (actualStart > 0) {
                    echo "   WARNING: Found non-JSON content at start (${actualStart} chars), extracting JSON..."
                    jsonContent = jsonContent.substring(actualStart)
                }
            }
            
            def jsonData = new groovy.json.JsonSlurper().parseText(jsonContent)
            
            echo "JSON structure type: ${jsonData.getClass().simpleName}"
            
            // Playwright JSON can be a Map with key "suites" or a List
            def suites = []
            if (jsonData instanceof List) {
                suites = jsonData
                echo "   JSON is a List with ${jsonData.size()} items"
            } else if (jsonData instanceof Map) {
                echo "   JSON is a Map with keys: ${jsonData.keySet()}"
                if (jsonData.suites) {
                    suites = jsonData.suites
                    echo "   Found ${suites.size()} suites in JSON"
                }
            }
            
            if (suites && !suites.isEmpty()) {
                echo "   Processing ${suites.size()} suites..."
                suites.each { suite ->
                    // Debug: Log suite structure
                    echo "   Suite keys: ${suite.keySet()}"
                    echo "   Suite specs type: ${suite.specs?.getClass()?.simpleName}"
                    echo "   Suite specs is null: ${suite.specs == null}"
                    echo "   Suite specs isEmpty: ${suite.specs?.isEmpty()}"
                    echo "   Suite has suites: ${suite.suites != null}"
                    echo "   Suite suites size: ${suite.suites?.size()}"
                    
                    // Try to get specs - could be array or nested
                    def specsList = []
                    if (suite.specs instanceof List) {
                        specsList = suite.specs
                        echo "   Suite has ${specsList.size()} specs (List)"
                    } else if (suite.specs instanceof Map) {
                        // Specs might be a Map, try to get values
                        specsList = suite.specs.values() as List
                        echo "   Suite has ${specsList.size()} specs (Map converted to List)"
                    } else if (suite.specs) {
                        // Try to convert to list
                        specsList = [suite.specs]
                        echo "   Suite has 1 spec (single object)"
                    }
                    
                    if (specsList && !specsList.isEmpty()) {
                        specsList.each { spec ->
                            // Debug: Log spec structure
                            echo "   Spec keys: ${spec.keySet()}"
                            echo "   Spec title: ${spec.title}"
                            echo "   Spec file: ${spec.file}"
                            echo "   Spec tests type: ${spec.tests?.getClass()?.simpleName}"
                            echo "   Spec tests count: ${spec.tests ? (spec.tests instanceof List ? spec.tests.size() : (spec.tests instanceof Map ? spec.tests.size() : 1)) : 0}"
                            
                            def testsList = []
                            if (spec.tests instanceof List) {
                                testsList = spec.tests
                                echo "   Spec has ${testsList.size()} tests (List)"
                            } else if (spec.tests instanceof Map) {
                                testsList = spec.tests.values() as List
                                echo "   Spec has ${testsList.size()} tests (Map converted to List)"
                            } else if (spec.tests) {
                                testsList = [spec.tests]
                                echo "   Spec has 1 test (single object)"
                            }
                            
                            if (testsList && !testsList.isEmpty()) {
                                testsList.each { test ->
                            results.total++
                                    
                                    // Debug: Log test structure
                                    echo "   Test keys: ${test.keySet()}"
                                    echo "   Test title: ${test.title}"
                                    echo "   Test fullTitle: ${test.fullTitle}"
                                    echo "   Test titlePath: ${test.titlePath}"
                                    echo "   Test location: ${test.location}"
                                    echo "   Spec title: ${spec.title}"
                                    echo "   Spec file: ${spec.file}"
                                    echo "   Test raw JSON (first 800 chars): ${groovy.json.JsonOutput.toJson(test).take(800)}"
                                    
                                    // Get result from test.results array (may have multiple results due to retry)
                                    def testResult = null
                                    if (test.results && !test.results.isEmpty()) {
                                        // Get the last result (after retry)
                                        testResult = test.results[test.results.size() - 1]
                                    }
                                    
                                    def status = testResult?.status ?: (test.ok == false ? 'failed' : (test.ok == true ? 'passed' : 'unknown'))
                                    def duration = testResult?.duration ?: 0
                            
                                    // Get test title - try multiple sources in order of preference
                                    def testTitle = null
                                    
                                    // 1. Try test.title directly
                                    if (test.title && test.title.toString().trim() != '') {
                                        testTitle = test.title.toString().trim()
                                        echo "   Got title from test.title: ${testTitle}"
                                    }
                                    
                                    // 2. Try fullTitle if title is not available
                                    if (!testTitle && test.fullTitle) {
                                        // fullTitle format: "file:line:column > describe > test"
                                        if (test.fullTitle instanceof String) {
                                            def parts = test.fullTitle.split(' > ')
                                            if (parts.length > 0) {
                                                testTitle = parts[parts.length - 1].trim()
                                                echo "   Got title from test.fullTitle: ${testTitle}"
                                            }
                                        }
                                    }
                                    
                                    // 3. Try titlePath if still not found
                                    if (!testTitle && test.titlePath) {
                                        // titlePath is array, get last element
                                        if (test.titlePath instanceof List && !test.titlePath.isEmpty()) {
                                            testTitle = test.titlePath[test.titlePath.size() - 1].toString().trim()
                                            echo "   Got title from test.titlePath (array): ${testTitle}"
                                        } else if (test.titlePath instanceof String) {
                                            // Parse titlePath string like " > frontend-chromium > ... > Test Name"
                                            def parts = test.titlePath.split(' > ')
                                            if (parts.length > 0) {
                                                testTitle = parts[parts.length - 1].trim()
                                                echo "   Got title from test.titlePath (string): ${testTitle}"
                                            }
                                        }
                                    }
                                    
                                    // 4. Try spec.title as fallback (Playwright JSON format)
                                    // spec.title might be "Login Feature > should display login button..."
                                    if (!testTitle && spec.title && spec.title.toString().trim() != '') {
                                        def specTitle = spec.title.toString().trim()
                                        // Check if spec.title contains test description with " > "
                                        if (specTitle.contains(' > ')) {
                                            def parts = specTitle.split(' > ')
                                            if (parts.length > 1) {
                                                // Get the last part which should be the test name
                                                testTitle = parts[parts.length - 1].trim()
                                                echo "   Got title from spec.title (parsed): ${testTitle}"
                                            } else {
                                                testTitle = specTitle
                                                echo "   Got title from spec.title: ${testTitle}"
                                            }
                                        } else {
                                            // spec.title is just suite name, use as fallback
                                            testTitle = specTitle
                                            echo "   Got title from spec.title (suite name): ${testTitle}"
                                        }
                                    }
                                    
                                    // 5. Try to get from test location or file
                                    if (!testTitle && test.location) {
                                        if (test.location instanceof Map && test.location.file) {
                                            // Extract from file path if needed
                                            def fileName = test.location.file.toString()
                                            def fileParts = fileName.split('/')
                                            if (fileParts.length > 0) {
                                                testTitle = fileParts[fileParts.length - 1].replace('.spec.ts', '').replace('.test.ts', '')
                                                echo "   Got title from test.location.file: ${testTitle}"
                                            }
                                        }
                                    }
                                    
                                    // 6. Last resort: use spec.file
                                    if (!testTitle && spec.file) {
                                        def fileName = spec.file.toString()
                                        def fileParts = fileName.split('/')
                                        if (fileParts.length > 0) {
                                            testTitle = fileParts[fileParts.length - 1].replace('.spec.ts', '').replace('.test.ts', '')
                                            echo "   Got title from spec.file: ${testTitle}"
                                        }
                                    }
                                    
                                    if (!testTitle || testTitle.trim() == '') {
                                        testTitle = 'Unknown test'
                                        echo "   WARNING: Could not extract test title, using default"
                                        echo "   DEBUG - Full test object: ${groovy.json.JsonOutput.toJson(test).take(1000)}"
                                        echo "   DEBUG - Spec object: ${groovy.json.JsonOutput.toJson(spec).take(500)}"
                                    }
                            
                            def testCase = [
                                        title: testTitle,
                                        status: status,
                                        duration: duration,
                                error: null
                            ]
                            
                                    if (status == 'passed') {
                                results.passed++
                                    } else if (status == 'failed') {
                                results.failed++
                                        def errorObj = testResult?.error
                                if (errorObj) {
                                            if (errorObj instanceof Map) {
                                    testCase.error = errorObj.message ?: errorObj.toString()
                                } else {
                                                testCase.error = errorObj.toString()
                                            }
                                        }
                                    } else if (status == 'skipped') {
                                        results.skipped++
                                    }
                                    
                                    results.duration += duration
                                    results.testCases.add(testCase)
                                    echo "   Parsed test: ${testCase.title} - ${testCase.status}"
                                }
                            } else {
                                echo "   WARNING: Spec has no tests (or tests is empty/null)"
                            }
                        }
                    } else {
                        echo "   WARNING: Suite has no specs (or specs is empty/null)"
                        
                        // Try nested suites structure
                        if (suite.suites && !suite.suites.isEmpty()) {
                            echo "   Found nested suites, processing recursively..."
                            def nestedSuites = suite.suites instanceof List ? suite.suites : [suite.suites]
                            nestedSuites.each { nestedSuite ->
                                echo "   Nested suite keys: ${nestedSuite.keySet()}"
                                
                                def nestedSpecs = []
                                if (nestedSuite.specs instanceof List) {
                                    nestedSpecs = nestedSuite.specs
                                } else if (nestedSuite.specs) {
                                    nestedSpecs = [nestedSuite.specs]
                                }
                                
                                if (nestedSpecs && !nestedSpecs.isEmpty()) {
                                    nestedSpecs.each { spec ->
                                        def testsList = []
                                        if (spec.tests instanceof List) {
                                            testsList = spec.tests
                                        } else if (spec.tests) {
                                            testsList = [spec.tests]
                                        }
                                        
                                        if (testsList && !testsList.isEmpty()) {
                                            testsList.each { test ->
                                                results.total++
                                                
                                                // Debug: Log test structure
                                                echo "   Test keys: ${test.keySet()}"
                                                echo "   Test title: ${test.title}"
                                                echo "   Test titlePath: ${test.titlePath}"
                                                echo "   Nested suite title: ${nestedSuite.title}"
                                                echo "   Spec title: ${spec.title}"
                                                echo "   Test annotations: ${test.annotations}"
                                                
                                                def testResult = null
                                                if (test.results && !test.results.isEmpty()) {
                                                    testResult = test.results[test.results.size() - 1]
                                                }
                                                
                                                def status = testResult?.status ?: (test.ok == false ? 'failed' : (test.ok == true ? 'passed' : 'unknown'))
                                                def duration = testResult?.duration ?: 0
                                        
                                                // Get test title - try multiple sources in order of preference
                                                def testTitle = null
                                                
                                                // 1. Try nested suite title FIRST (Playwright JSON format: "Login Feature > should login...")
                                                if (!testTitle && nestedSuite.title && nestedSuite.title.toString().trim() != '') {
                                                    def suiteTitle = nestedSuite.title.toString().trim()
                                                    // Check if suite title contains test description with " > " or " › "
                                                    if (suiteTitle.contains(' > ') || suiteTitle.contains(' › ')) {
                                                        def separator = suiteTitle.contains(' > ') ? ' > ' : ' › '
                                                        def parts = suiteTitle.split(separator)
                                                        if (parts.length > 1) {
                                                            // Get the last part which should be the test name
                                                            testTitle = parts[parts.length - 1].trim()
                                                            echo "   Got title from nested suite title (parsed): ${testTitle}"
                                                        } else {
                                                            testTitle = suiteTitle
                                                            echo "   Got title from nested suite title: ${testTitle}"
                                                        }
                                                    } else {
                                                        // Suite title might be just suite name, keep for later fallback
                                                        echo "   INFO: Nested suite title is suite name only: ${suiteTitle}"
                                                    }
                                                }
                                                
                                                // 2. Try test.title directly
                                                if (!testTitle && test.title && test.title.toString().trim() != '') {
                                                    testTitle = test.title.toString().trim()
                                                    echo "   Got title from test.title: ${testTitle}"
                                                }
                                                
                                                // 3. Try test.annotations (Playwright might store test name here)
                                                if (!testTitle && test.annotations) {
                                                    def annotations = test.annotations instanceof List ? test.annotations : [test.annotations]
                                                    annotations.each { annotation ->
                                                        if (annotation instanceof Map && annotation.description) {
                                                            def desc = annotation.description.toString().trim()
                                                            if (desc && desc != '') {
                                                                testTitle = desc
                                                                echo "   Got title from test.annotations: ${testTitle}"
                                                                return
                                                            }
                                                        }
                                                    }
                                                }
                                                
                                                // 4. Try spec.title (might be "Login Feature > should login...")
                                                if (!testTitle && spec.title && spec.title.toString().trim() != '') {
                                                    def specTitle = spec.title.toString().trim()
                                                    if (specTitle.contains(' > ') || specTitle.contains(' › ')) {
                                                        def separator = specTitle.contains(' > ') ? ' > ' : ' › '
                                                        def parts = specTitle.split(separator)
                                                        if (parts.length > 1) {
                                                            testTitle = parts[parts.length - 1].trim()
                                                            echo "   Got title from spec.title (parsed): ${testTitle}"
                                                        } else {
                                                            testTitle = specTitle
                                                            echo "   Got title from spec.title: ${testTitle}"
                                                        }
                                                    } else {
                                                        testTitle = specTitle
                                                        echo "   Got title from spec.title (suite name): ${testTitle}"
                                                    }
                                                }
                                                
                                                // 5. Try fullTitle if title is not available
                                                if (!testTitle && test.fullTitle) {
                                                    if (test.fullTitle instanceof String) {
                                                        def parts = test.fullTitle.split(' > ')
                                                        if (parts.length > 0) {
                                                            testTitle = parts[parts.length - 1].trim()
                                                            echo "   Got title from test.fullTitle: ${testTitle}"
                                                        }
                                                    }
                                                }
                                                
                                                // 6. Try titlePath if still not found
                                                if (!testTitle && test.titlePath) {
                                                    if (test.titlePath instanceof List && !test.titlePath.isEmpty()) {
                                                        testTitle = test.titlePath[test.titlePath.size() - 1].toString().trim()
                                                        echo "   Got title from test.titlePath (array): ${testTitle}"
                                                    } else if (test.titlePath instanceof String) {
                                                        def parts = test.titlePath.split(' > ')
                                                        if (parts.length > 0) {
                                                            testTitle = parts[parts.length - 1].trim()
                                                            echo "   Got title from test.titlePath (string): ${testTitle}"
                                                        }
                                                    }
                                                }
                                                
                                                // 7. Try to get from test location or file
                                                if (!testTitle && test.location) {
                                                    if (test.location instanceof Map && test.location.file) {
                                                        def fileName = test.location.file.toString()
                                                        def fileParts = fileName.split('/')
                                                        if (fileParts.length > 0) {
                                                            testTitle = fileParts[fileParts.length - 1].replace('.spec.ts', '').replace('.test.ts', '')
                                                            echo "   Got title from test.location.file: ${testTitle}"
                                                        }
                                                    }
                                                }
                                                
                                                // 8. Last resort: use nested suite title as-is
                                                if (!testTitle && nestedSuite.title && nestedSuite.title.toString().trim() != '') {
                                                    testTitle = nestedSuite.title.toString().trim()
                                                    echo "   Got title from nested suite title (fallback): ${testTitle}"
                                                }
                                                
                                                if (!testTitle || testTitle.trim() == '') {
                                                    testTitle = 'Unknown test'
                                                    echo "   WARNING: Could not extract test title, using default"
                                                    echo "   DEBUG - Full test object: ${groovy.json.JsonOutput.toJson(test).take(1000)}"
                                                    echo "   DEBUG - Nested suite object: ${groovy.json.JsonOutput.toJson(nestedSuite).take(500)}"
                                                }
                                        
                                                def testCase = [
                                                    title: testTitle,
                                                    status: status,
                                                    duration: duration,
                                                    error: null
                                                ]
                                        
                                                if (status == 'passed') {
                                                    results.passed++
                                                } else if (status == 'failed') {
                                                    results.failed++
                                                    def errorObj = testResult?.error
                                                    if (errorObj) {
                                                        if (errorObj instanceof Map) {
                                                            testCase.error = errorObj.message ?: errorObj.toString()
                                                        } else {
                                                            testCase.error = errorObj.toString()
                                                        }
                                                    }
                                                } else if (status == 'skipped') {
                                                    results.skipped++
                                                }
                                                
                                                results.duration += duration
                                                results.testCases.add(testCase)
                                                echo "   Parsed test from nested suite: ${testCase.title} - ${testCase.status}"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Try alternative structure: suite might contain tests directly
                        if (suite.tests) {
                            def testsList = []
                            if (suite.tests instanceof List) {
                                testsList = suite.tests
                            } else if (suite.tests instanceof Map) {
                                testsList = suite.tests.values() as List
                            } else {
                                testsList = [suite.tests]
                            }
                            
                            echo "   Suite has ${testsList.size()} tests directly"
                            testsList.each { test ->
                                results.total++
                                
                                // Debug: Log test structure
                                echo "   Test keys: ${test.keySet()}"
                                echo "   Test title: ${test.title}"
                                echo "   Test titlePath: ${test.titlePath}"
                                
                                def testResult = null
                                if (test.results && !test.results.isEmpty()) {
                                    testResult = test.results[test.results.size() - 1]
                                }
                                
                                def status = testResult?.status ?: (test.ok == false ? 'failed' : (test.ok == true ? 'passed' : 'unknown'))
                                def duration = testResult?.duration ?: 0
                                
                                // Get test title - try multiple sources in order of preference
                                def testTitle = null
                                
                                // 1. Try test.title directly
                                if (test.title && test.title.toString().trim() != '') {
                                    testTitle = test.title.toString().trim()
                                }
                                
                                // 2. Try fullTitle if title is not available
                                if (!testTitle && test.fullTitle) {
                                    if (test.fullTitle instanceof String) {
                                        def parts = test.fullTitle.split(' > ')
                                        if (parts.length > 0) {
                                            testTitle = parts[parts.length - 1].trim()
                                        }
                                    }
                                }
                                
                                // 3. Try titlePath if still not found
                                if (!testTitle && test.titlePath) {
                                    if (test.titlePath instanceof List && !test.titlePath.isEmpty()) {
                                        testTitle = test.titlePath[test.titlePath.size() - 1].toString().trim()
                                    } else if (test.titlePath instanceof String) {
                                        def parts = test.titlePath.split(' > ')
                                        if (parts.length > 0) {
                                            testTitle = parts[parts.length - 1].trim()
                                        }
                                    }
                                }
                                
                                // 4. Try to get from test location or file
                                if (!testTitle && test.location) {
                                    if (test.location instanceof Map && test.location.file) {
                                        def fileName = test.location.file.toString()
                                        def fileParts = fileName.split('/')
                                        if (fileParts.length > 0) {
                                            testTitle = fileParts[fileParts.length - 1].replace('.spec.ts', '').replace('.test.ts', '')
                                        }
                                    }
                                }
                                
                                if (!testTitle || testTitle.trim() == '') {
                                    testTitle = 'Unknown test'
                                }
                                
                                def testCase = [
                                    title: testTitle,
                                    status: status,
                                    duration: duration,
                                    error: null
                                ]
                                
                                if (status == 'passed') {
                                    results.passed++
                                } else if (status == 'failed') {
                                    results.failed++
                                    def errorObj = testResult?.error
                                    if (errorObj) {
                                        if (errorObj instanceof Map) {
                                            testCase.error = errorObj.message ?: errorObj.toString()
                                        } else {
                                            testCase.error = errorObj.toString()
                                        }
                                    }
                                } else if (status == 'skipped') {
                                    results.skipped++
                                }
                                
                                results.duration += duration
                                results.testCases.add(testCase)
                                echo "   Parsed test: ${testCase.title} - ${testCase.status}"
                            }
                        }
                    }
                }
                echo "   Parsed ${results.total} test cases: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped"
            } else {
                echo "WARNING: No suites found in JSON data"
            }
        } else {
            echo "WARNING: Test results JSON file not found in any expected location"
            echo "   Searched locations: ${jsonFiles.join(', ')}"
        }
    } catch (Exception e) {
        echo "ERROR: Error parsing test results: ${e.getMessage()}"
        echo "   Error class: ${e.getClass().name}"
    }
    
    return results
}

def commentDetailedResultsToPR(testResults) {
    if (!env.GITHUB_TOKEN) {
        echo "WARNING: GitHub token not found. Skipping PR comment."
        return false
    }

    // Determine status based on test results, not build result
    def total = testResults.total ?: 0
    def passed = testResults.passed ?: 0
    def failed = testResults.failed ?: 0
    def skipped = testResults.skipped ?: 0
    def duration = testResults.duration ?: 0
    
    def statusText = (failed > 0) ? 'FAILED' : (total > 0 && passed == total) ? 'PASSED' : 'UNKNOWN'
    def statusText = (failed > 0) ? 'FAILED' : (total > 0 && passed == total) ? 'PASSED' : 'UNKNOWN'
    def jobUrl = "${env.BUILD_URL}"
    
    def comment = """
        ## Automation Test Results

        **Test File:** `tests/e2e/features/login/cases/case-02-button-login/test.spec.ts`
        **Status:** **${statusText}**
        **Test Job:** [View Details #${env.BUILD_NUMBER}](${jobUrl})
        **Duration:** ${String.format("%.2f", duration / 1000)}s

        ### Test Summary

        | Metric | Count |
        |--------|-------|
        | **Total Tests** | ${total} |
        | **Passed** | ${passed} |
        | **Failed** | ${failed} |
        | **Skipped** | ${skipped} |

    """
    
    // Generate Allure report URL
    def allureReportUrl = generateAllureReportUrl()
    
    // Display simple test cases list with View-Detail link
    if (testResults.testCases && !testResults.testCases.isEmpty()) {
        comment += "### Test Cases Executed\n\n"
        
        testResults.testCases.eachWithIndex { test, index ->
            def statusText = test.status == 'passed' ? 'PASSED' : (test.status == 'failed' ? 'FAILED' : 'SKIPPED')
            def testTitle = test.title?.toString() ?: "Test ${index + 1}"
            
            // Generate Allure link for this test case
            def allureTestUrl = generateAllureTestCaseUrl(testTitle, allureReportUrl)
            
            if (allureTestUrl) {
                comment += "${index + 1}. [${statusText}] **${testTitle}** - [View-Detail](${allureTestUrl})\n"
            } else {
                comment += "${index + 1}. [${statusText}] **${testTitle}**\n"
            }
        }
        
        comment += "\n"
    } else {
        comment += "### WARNING: No Test Cases Found\n\n"
        comment += "No test cases were executed or parsed. Please check the test execution logs.\n\n"
    }
    
    // Post comment to PR
    try {
        // Use override values if available (from PR URL parsing), otherwise use parameters
        def repo = env.PR_REPO_OVERRIDE ?: params.PR_REPO?.toString() ?: ''
        def owner = env.PR_OWNER_OVERRIDE ?: params.PR_OWNER?.toString() ?: ''
        def prNumber = params.PR_NUMBER?.toString() ?: ''
        
        echo "Posting comment to PR #${prNumber}..."
        echo "   Repository: ${owner}/${repo}"
        echo "   Source: ${env.PR_REPO_OVERRIDE ? 'PR URL' : 'Parameters'}"
        
        if (!repo || !owner || !prNumber) {
            echo "WARNING: Missing PR parameters. Skipping comment."
            echo "   PR_REPO: ${repo ?: 'missing'}"
            echo "   PR_OWNER: ${owner ?: 'missing'}"
            echo "   PR_NUMBER: ${prNumber ?: 'missing'}"
            return false
        }
        echo "   Total test cases: ${total}"
        echo "   Test cases in list: ${testResults.testCases?.size() ?: 0}"
        
        // First, verify PR exists
        def verifyUrl = "https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}"
        def verifyResponse = sh(
            script: """
                curl -s -w "\\nHTTP_CODE:%{http_code}" \
                    -H "Authorization: token ${env.GITHUB_TOKEN}" \
                    -H "Accept: application/vnd.github.v3+json" \
                    ${verifyUrl}
            """,
            returnStdout: true
        )
        
        def verifyHttpCode = verifyResponse.split('HTTP_CODE:')[1]?.trim()
        if (verifyHttpCode != '200') {
            echo "ERROR: PR #${prNumber} not found in ${owner}/${repo} (HTTP ${verifyHttpCode})"
            echo "   Please verify PR number and repository name are correct"
            return false
        }
        
        def apiUrl = "https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments"
        
        // Ensure comment is a plain String
        def commentString = comment.toString()
        
        // Create JSON body
        def jsonBody = groovy.json.JsonOutput.toJson([body: commentString])
        
        writeFile file: 'pr-comment.json', text: jsonBody
        
        def response = sh(
            script: """
                curl -s -w "\\nHTTP_CODE:%{http_code}" \
                    -H "Authorization: token ${env.GITHUB_TOKEN}" \
                    -H "Content-Type: application/json" \
                    -X POST \
                    -d @pr-comment.json \
                    ${apiUrl}
            """,
            returnStdout: true
        )
        
        def httpCode = response.split('HTTP_CODE:')[1]?.trim()
        def responseBody = response.split('HTTP_CODE:')[0]?.trim()
        
        if (httpCode == '201' || httpCode == '200') {
            echo "Comment posted successfully to PR #${prNumber}"
            return true
        } else {
            echo "ERROR: Failed to post comment. HTTP ${httpCode}"
            echo "   API URL: ${apiUrl}"
            echo "   Repo: ${owner}/${repo}"
            echo "   PR Number: ${prNumber}"
            echo "   Response: ${responseBody.take(1000)}"
            
            // Try to parse error message
            try {
                def errorData = new groovy.json.JsonSlurper().parseText(responseBody)
                if (errorData.message) {
                    echo "   Error message: ${errorData.message}"
                }
                if (errorData.documentation_url) {
                    echo "   Documentation: ${errorData.documentation_url}"
                }
            } catch (Exception e) {
                // Ignore parse error
            }
            return false
        }
    } catch (Exception e) {
        echo "ERROR: Failed to post comment to PR: ${e.getMessage()}"
        echo "   Error class: ${e.getClass().name}"
        return false
    }
}

def getCommitSHA() {
    try {
        def prBranch = params.PR_BRANCH?.toString()?.trim()
        if (prBranch && prBranch != 'null' && prBranch != '') {
            def sha = sh(
                script: "git rev-parse origin/${prBranch} 2>/dev/null || git rev-parse HEAD",
                returnStdout: true
            ).trim()
            if (sha && sha != '') {
                return sha
            }
        }
        def sha = sh(
            script: 'git rev-parse HEAD',
            returnStdout: true
        ).trim()
        return sha
    } catch (Exception e) {
        echo "WARNING: Error getting commit SHA: ${e.getMessage()}"
        return null
    }
}

def createAnnotationsFromTestResults(testResults) {
    def annotations = []
    
    if (!testResults.testCases || testResults.testCases.isEmpty()) {
        return annotations
    }
    
    def jsonFile = findTestResultsJsonFile()
    if (!jsonFile) {
        echo "WARNING: Could not find test results JSON file for annotations"
        return annotations
    }
    
    try {
        def jsonContent = readFile(jsonFile).trim()
        
        def jsonStart = jsonContent.indexOf('[')
        def jsonStartBrace = jsonContent.indexOf('{')
        if (jsonStart >= 0 || jsonStartBrace >= 0) {
            def actualStart = (jsonStart >= 0 && jsonStartBrace >= 0) ? 
                Math.min(jsonStart, jsonStartBrace) : 
                (jsonStart >= 0 ? jsonStart : jsonStartBrace)
            if (actualStart > 0) {
                jsonContent = jsonContent.substring(actualStart)
            }
        }
        
        def jsonData = new groovy.json.JsonSlurper().parseText(jsonContent)
        def suites = []
        if (jsonData instanceof List) {
            suites = jsonData
        } else if (jsonData instanceof Map && jsonData.suites) {
            suites = jsonData.suites
        }
        
        def testIndex = 0
        suites.each { suite ->
            if (suite.specs) {
                suite.specs.each { spec ->
                    def filePath = spec.file ?: spec.title ?: ''
                    if (spec.tests) {
                        spec.tests.each { test ->
                            if (testIndex < testResults.testCases.size()) {
                                def testCase = testResults.testCases[testIndex]
                                
                                if (testCase.status == 'failed') {
                                    def testResult = null
                                    if (test.results && !test.results.isEmpty()) {
                                        testResult = test.results[test.results.size() - 1]
                                    }
                                    
                                    def line = testResult?.line ?: test.location?.line ?: 1
                                    def errorMessage = testCase.error ?: (testResult?.error?.message ?: 'Test failed')
                                    
                                    def normalizedPath = filePath.replace(env.WORKSPACE + '/', '')
                                    
                                    annotations.add([
                                        path: normalizedPath,
                                        start_line: line,
                                        end_line: line,
                                        annotation_level: 'failure',
                                        message: errorMessage.take(500),
                                        title: testCase.title ?: 'Test failed'
                                    ])
                                }
                                
                                testIndex++
                            }
                        }
                    }
                }
            }
        }
        
        echo "   Created ${annotations.size()} annotations for failed tests"
    } catch (Exception e) {
        echo "WARNING: Error creating annotations: ${e.getMessage()}"
    }
    
    return annotations.take(50)
}

def findTestResultsJsonFile() {
    def jsonFiles = [
        'test-results/results.json',
        'test-results.json',
        'test-results/.last-run.json',
        'playwright-report/test-results.json'
    ]
    
    for (def file : jsonFiles) {
        if (fileExists(file)) {
            return file
        }
    }
    
    def foundFiles = sh(
        script: 'find test-results -name "*.json" -type f 2>/dev/null | head -1',
        returnStdout: true
    ).trim()
    
    return foundFiles ?: null
}

def createGitHubCheck(Map params) {
    def repo = params.repo?.toString() ?: ''
    def owner = params.owner?.toString() ?: ''
    def sha = params.sha?.toString() ?: ''
    def testResults = params.testResults ?: [:]
    def annotations = params.annotations ?: []
    
    echo "GitHub Check Parameters:"
    echo "   Repo: ${repo}"
    echo "   Owner: ${owner}"
    echo "   SHA: ${sha.take(7)}..."
    echo "   Test Results: ${testResults.total ?: 0} tests"
    
    if (!env.GITHUB_TOKEN || !repo || !owner || !sha) {
        echo "WARNING: Missing required parameters for GitHub Check. Skipping."
        echo "   GITHUB_TOKEN: ${env.GITHUB_TOKEN ? 'Set' : 'Missing'}"
        echo "   Repo: ${repo ?: 'Missing'}"
        echo "   Owner: ${owner ?: 'Missing'}"
        echo "   SHA: ${sha ?: 'Missing'}"
        return
    }
    
    def total = testResults.total instanceof Number ? testResults.total : (testResults.total?.toString()?.toInteger() ?: 0)
    def passed = testResults.passed instanceof Number ? testResults.passed : (testResults.passed?.toString()?.toInteger() ?: 0)
    def failed = testResults.failed instanceof Number ? testResults.failed : (testResults.failed?.toString()?.toInteger() ?: 0)
    def skipped = testResults.skipped instanceof Number ? testResults.skipped : (testResults.skipped?.toString()?.toInteger() ?: 0)
    def duration = testResults.duration instanceof Number ? testResults.duration : (testResults.duration?.toString()?.toLong() ?: 0)
    
    def conclusion = failed > 0 ? 'failure' : 'success'
    def statusText = failed > 0 ? 'FAILED' : 'PASSED'
    
    // Build test cases list for display
    def testCasesListText = ''
    echo "Building test cases list for GitHub Check..."
    echo "   testResults.testCases exists: ${testResults.testCases != null}"
    echo "   testResults.testCases isEmpty: ${testResults.testCases?.isEmpty()}"
    echo "   testResults.testCases size: ${testResults.testCases?.size() ?: 0}"
    
    if (testResults.testCases && !testResults.testCases.isEmpty()) {
        def testCasesLines = []
        testResults.testCases.eachWithIndex { test, index ->
            def statusText = test.status == 'passed' ? 'PASSED' : test.status == 'failed' ? 'FAILED' : 'SKIPPED'
            def testTitle = test.title?.toString() ?: "Test ${index + 1}"
            def testStatus = test.status?.toString() ?: 'unknown'
            def testDuration = test.duration instanceof Number ? test.duration : (test.duration?.toString()?.toInteger() ?: 0)
            def durationStr = testDuration > 0 ? String.format(" (%.2fs)", testDuration / 1000) : ''
            testCasesLines.add("${index + 1}. [${statusText}] **${testTitle}** - ${testStatus}${durationStr}")
        }
        testCasesListText = testCasesLines.join('\n')
        echo "Built test cases list with ${testCasesLines.size()} items"
    } else {
        testCasesListText = 'WARNING: No test cases found in results'
        echo "WARNING: No test cases to display"
    }
    
    // Build summary with test cases
    def summaryLines = [
        "## Test Results Summary",
        "",
        "- **Total Tests**: ${total}",
        "- **Passed**: ${passed}",
        "- **Failed**: ${failed}",
        "- **Skipped**: ${skipped}",
        "- **Duration**: ${String.format("%.2f", duration / 1000)}s",
        ""
    ]
    
    if (failed > 0) {
        summaryLines.add("WARNING: ${failed} test(s) failed. Please review the annotations below.")
    } else {
        summaryLines.add("All tests passed!")
    }
    
    summaryLines.add("")
    summaryLines.add("### Test Cases Executed")
    summaryLines.add("")
    
    if (testCasesListText && testCasesListText != 'WARNING: No test cases found in results') {
        summaryLines.add(testCasesListText)
    } else {
        summaryLines.add("No test cases found")
    }
    
    summaryLines.add("")
    summaryLines.add("### View Detailed Reports")
    summaryLines.add("")
    summaryLines.add("[View Jenkins Build](${env.BUILD_URL})")
    summaryLines.add("[Download Test Artifacts](${env.BUILD_URL}artifact/)")
    
    def summary = summaryLines.join('\n')
    
    def detailedText = """
## Test Execution Details

**Build**: #${env.BUILD_NUMBER}  
**Duration**: ${String.format("%.2f", duration / 1000)}s  
**Status**: ${statusText} ${failed > 0 ? 'Some tests failed' : 'All tests passed'}

### Quick Links

[View Jenkins Build](${env.BUILD_URL})  
[Download Test Artifacts](${env.BUILD_URL}artifact/)

### Test Cases

${testCasesListText}
"""
    
    // Build title with test summary
    def titleText = "Integration Test - ${total} tests"
    if (total > 0) {
        titleText += " (${passed} passed"
        if (failed > 0) {
            titleText += ", ${failed} failed"
        }
        if (skipped > 0) {
            titleText += ", ${skipped} skipped"
        }
        titleText += ")"
    }
    
    def checkRunData = [
        name: 'Integration Test',
        head_sha: sha,
        status: 'completed',
        conclusion: conclusion,
        output: [
            title: titleText,
            summary: summary,
            text: detailedText,
            annotations: annotations
        ]
    ]
    
    echo "GitHub Check Data:"
    echo "   Title: ${titleText}"
    echo "   Summary length: ${summary.length()} chars"
    echo "   Text length: ${detailedText.length()} chars"
    echo "   Annotations: ${annotations.size()}"
    
    try {
        def apiUrl = "https://api.github.com/repos/${owner}/${repo}/check-runs"
        def jsonBody = groovy.json.JsonOutput.toJson(checkRunData)
        
        writeFile file: 'github-check.json', text: jsonBody
        
        def response = sh(
            script: """
                curl -s -w "\\nHTTP_CODE:%{http_code}" \
                    -X POST \
                    -H "Authorization: token ${env.GITHUB_TOKEN}" \
                    -H "Accept: application/vnd.github.v3+json" \
                    -H "Content-Type: application/json" \
                    -d @github-check.json \
                    ${apiUrl}
            """,
            returnStdout: true
        )
        
        def httpCode = response.split('HTTP_CODE:')[1]?.trim()
        def responseBody = response.split('HTTP_CODE:')[0]?.trim()
        
        if (httpCode == '201' || httpCode == '200') {
            def checkRun = new groovy.json.JsonSlurper().parseText(responseBody)
            echo "GitHub Check created: ${checkRun.html_url}"
            echo "   Check ID: ${checkRun.id}"
            echo "   Status: ${conclusion}"
            echo "   Annotations: ${annotations.size()}"
        } else {
            echo "ERROR: Failed to create GitHub Check. HTTP ${httpCode}"
            echo "   API URL: ${apiUrl}"
            echo "   Repo: ${owner}/${repo}"
            echo "   Response: ${responseBody.take(1000)}"
            
            // Try to parse error message
            try {
                def errorData = new groovy.json.JsonSlurper().parseText(responseBody)
                if (errorData.message) {
                    echo "   Error message: ${errorData.message}"
                }
                if (errorData.documentation_url) {
                    echo "   Documentation: ${errorData.documentation_url}"
                }
            } catch (Exception e) {
                // Ignore parse error
            }
        }
    } catch (Exception e) {
        echo "ERROR: Error sending GitHub Check: ${e.getMessage()}"
        echo "   Error class: ${e.getClass().name}"
    }
}

def findNodeJsOnMac() {
    // Try using which/command -v first (most reliable - works if node is already in PATH)
    try {
        def nodeDir = sh(
            script: '''
                if command -v node >/dev/null 2>&1; then
                    dirname $(command -v node)
                else
                    echo ""
                fi
            ''',
            returnStdout: true
        ).trim()
        
        if (nodeDir && nodeDir != '') {
            echo "Found Node.js via command -v: ${nodeDir}"
            return nodeDir
        }
    } catch (Exception e) {
        echo "WARNING: Error finding Node.js via command -v: ${e.getMessage()}"
    }
    
    // Search for nvm installations
    try {
        def nvmPath = sh(
            script: '''
                # Check current user's nvm first
                if [ -d ~/.nvm/versions/node ]; then
                    ls -d ~/.nvm/versions/node/*/bin 2>/dev/null | tail -1
                # Use find to search for node binary in nvm directories
                else
                    find /Users -type f -path "*/.nvm/versions/node/*/bin/node" 2>/dev/null | head -1 | xargs dirname 2>/dev/null || echo ""
                fi
            ''',
            returnStdout: true
        ).trim()
        
        if (nvmPath && nvmPath != '') {
            echo "Found Node.js via nvm: ${nvmPath}"
            return nvmPath
        }
    } catch (Exception e) {
        echo "WARNING: Error finding nvm: ${e.getMessage()}"
    }
    
    // Check Homebrew paths
    def homebrewPaths = [
        '/opt/homebrew/bin',           // Apple Silicon
        '/usr/local/bin',               // Intel Mac
        '/opt/homebrew/opt/node/bin',   // Homebrew node on Apple Silicon
        '/usr/local/opt/node/bin'       // Homebrew node on Intel
    ]
    
    for (def path : homebrewPaths) {
        try {
            def result = sh(
                script: "test -f ${path}/node && echo ${path} || echo ''",
                returnStdout: true
            ).trim()
            if (result) {
                echo "Found Node.js at: ${result}"
                return result
            }
        } catch (Exception e) {
            // Continue searching
        }
    }
    
    return null
}

def generateAllureReportUrl() {
    try {
        // Generate Allure report URL: ${JENKINS_URL}job/${JOB_NAME}/${BUILD_NUMBER}/allure
        def jenkinsUrl = env.JENKINS_URL ?: ''
        def jobName = env.JOB_NAME ?: env.JOB_BASE_NAME ?: ''
        def buildNumber = env.BUILD_NUMBER ?: ''
        
        if (jenkinsUrl && jobName && buildNumber) {
            // Ensure JENKINS_URL ends with /, then add job path
            def baseUrl = jenkinsUrl.endsWith('/') ? jenkinsUrl : "${jenkinsUrl}/"
            def allureUrl = "${baseUrl}job/${jobName}/${buildNumber}/allure"
            echo "Generated Allure URL: ${allureUrl}"
            return allureUrl
        } else {
            echo "WARNING: Could not generate Allure URL - missing environment variables"
            echo "   JENKINS_URL: ${jenkinsUrl ?: 'missing'}"
            echo "   JOB_NAME: ${jobName ?: 'missing'}"
            echo "   BUILD_NUMBER: ${buildNumber ?: 'missing'}"
            return null
        }
    } catch (Exception e) {
        echo "ERROR: Error generating Allure URL: ${e.getMessage()}"
        return null
    }
}

def generateAllureTestCaseUrl(testTitle, baseAllureUrl) {
    try {
        if (!baseAllureUrl) {
            echo "WARNING: Base Allure URL is null, cannot generate test case URL"
            return null
        }
        
        echo "Looking for test case: ${testTitle}"
        
        // Try to find test case UUID from Allure results
        def testCaseInfo = findAllureTestCaseInfo(testTitle)
        
        if (testCaseInfo && testCaseInfo.uuid) {
            echo "Found test case info:"
            echo "   UUID: ${testCaseInfo.uuid}"
            echo "   Name: ${testCaseInfo.name}"
            echo "   Status: ${testCaseInfo.status}"
            echo "   Has error: ${testCaseInfo.error ? 'yes' : 'no'}"
            
            // Allure categories URL format:
            // ${baseUrl}/#categories/{categoryHash}/{testCaseUuid}/
            // Category hash is MD5 hash of error message (for failed tests)
            // Note: Allure may use a shortened UUID in the URL, but we'll use the full UUID first
            
            // Generate category hash from error message
            def categoryHash = null
            if (testCaseInfo.error && testCaseInfo.error.trim() != '') {
                categoryHash = generateMD5Hash(testCaseInfo.error)
                echo "   Category hash: ${categoryHash}"
            }
            
            if (categoryHash) {
                // Allure uses shortened UUID in URL for test case ID
                // From actual URLs, it appears to use 15 chars without dashes
                // However, the ID might come from historyId or a different part of UUID
                def uuidWithoutDashes = testCaseInfo.uuid.replaceAll('-', '')
                
                // Try different approaches to get test case ID
                def testCaseId = null
                
                // Approach 1: Try using historyId second part (if available)
                if (testCaseInfo.historyId && testCaseInfo.historyId.contains(':')) {
                    def historyParts = testCaseInfo.historyId.split(':')
                    if (historyParts.length > 1 && historyParts[1].length() >= 15) {
                        testCaseId = historyParts[1].take(15)
                        echo "   Using historyId-based ID (15 chars): ${testCaseId}"
                    }
                }
                
                // Approach 2: Use first 15 chars of UUID without dashes
                if (!testCaseId) {
                    testCaseId = uuidWithoutDashes.take(15)
                    echo "   Using UUID-based ID (15 chars): ${testCaseId}"
                }
                
                echo "   Full UUID: ${testCaseInfo.uuid}"
                echo "   UUID without dashes: ${uuidWithoutDashes} (${uuidWithoutDashes.length()} chars)"
                echo "   History ID: ${testCaseInfo.historyId ?: 'N/A'}"
                echo "   Final test case ID: ${testCaseId}"
                
                // Link directly to test case in categories
                def finalUrl = "${baseAllureUrl}/#categories/${categoryHash}/${testCaseId}/"
                echo "   Generated URL: ${finalUrl}"
                return finalUrl
            } else {
                // For passed tests or tests without error, link to categories page
                echo "   No category hash, linking to categories page"
                return "${baseAllureUrl}/#categories"
            }
        } else {
            echo "WARNING: Could not find test case info for: ${testTitle}"
            echo "   Fallback: linking to Allure report base URL"
            return "${baseAllureUrl}"
        }
    } catch (Exception e) {
        echo "WARNING: Error generating Allure test case URL: ${e.getMessage()}"
        echo "   Stack trace: ${e.getStackTrace().take(5).join('\n')}"
        return baseAllureUrl
    }
}

def findAllureTestCaseInfo(testTitle) {
    try {
        // Try to find test case info from Allure results JSON
        // Check multiple possible locations (same as Publish Allure Report stage)
        def allurePaths = [
            'allure-results',
            'tests/reports/allure/allure-results',
            'tests/reports/allure-results'
        ]
        
        def allureResultsPath = null
        def resultFiles = null
        
        // Find the first existing path with result files
        for (def path : allurePaths) {
            if (fileExists(path)) {
                def files = sh(
                    script: "find ${path} -name '*-result.json' -type f 2>/dev/null | head -1",
                    returnStdout: true
                ).trim()
                
                if (files) {
                    allureResultsPath = path
                    echo "Found Allure results at: ${path}"
                    break
                }
            }
        }
        
        if (!allureResultsPath) {
            echo "WARNING: Allure results path not found in any expected location"
            return null
        }
        
        // Find all result JSON files
        resultFiles = sh(
            script: "find ${allureResultsPath} -name '*-result.json' -type f 2>/dev/null",
            returnStdout: true
        ).trim()
        
        if (!resultFiles) {
            echo "WARNING: No Allure result files found in ${allureResultsPath}"
            return null
        }
        
        echo "Found ${resultFiles.split('\n').size()} Allure result files"
        
        // Normalize test title for matching (remove special chars, lowercase)
        def normalizedTitle = testTitle.toLowerCase().replaceAll(/[^a-z0-9\s]/, '').trim()
        echo "Searching for test: '${testTitle}' (normalized: '${normalizedTitle}')"
        
        // Parse each result file to find matching test
        def files = resultFiles.split('\n')
        for (def file : files) {
            if (file && file.trim() != '') {
                try {
                    def content = readFile(file.trim())
                    def jsonData = new groovy.json.JsonSlurper().parseText(content)
                    
                    // Check if test name matches
                    def testName = jsonData.name ?: jsonData.fullName ?: ''
                    def normalizedTestName = testName.toLowerCase().replaceAll(/[^a-z0-9\s]/, '').trim()
                    
                    // Match by exact name or contains
                    if (testName && (testName == testTitle || normalizedTestName == normalizedTitle || testName.contains(testTitle) || normalizedTestName.contains(normalizedTitle))) {
                        // Extract file path and name first
                        def filePath = file.trim()
                        def fileName = filePath.contains('/') ? filePath.substring(filePath.lastIndexOf('/') + 1) : filePath
                        
                        // Extract UUID - prefer UUID from JSON, fallback to filename
                        def uuid = jsonData.uuid ?: ''
                        if (!uuid) {
                            // Extract UUID from filename (avoid using File class due to Jenkins security)
                            uuid = fileName.replace('-result.json', '')
                        }
                        
                        // Get error message for category hash
                        def errorMessage = jsonData.statusDetails?.message ?: jsonData.statusDetails?.trace ?: ''
                        
                        echo "Matched test case:"
                        echo "   File: ${fileName}"
                        echo "   UUID from JSON: ${jsonData.uuid ?: 'N/A'}"
                        echo "   UUID used: ${uuid}"
                        echo "   Name: ${testName}"
                        echo "   History ID: ${jsonData.historyId ?: 'N/A'}"
                        
                        return [
                            uuid: uuid,
                            name: testName,
                            error: errorMessage,
                            status: jsonData.status ?: 'unknown',
                            historyId: jsonData.historyId ?: ''
                        ]
                    }
                } catch (Exception e) {
                    echo "WARNING: Error parsing file ${file}: ${e.getMessage()}"
                    // Continue to next file
                }x
            }
        }
        
        echo "WARNING: No matching test case found for: ${testTitle}"
        return null
    } catch (Exception e) {
        echo "WARNING: Error finding Allure test case info: ${e.getMessage()}"
        echo "   Stack trace: ${e.getStackTrace().take(5).join('\n')}"
        return null
    }
}

def generateMD5Hash(text) {
    try {
        if (!text || text.trim() == '') {
            return null
        }
        
        // Generate MD5 hash using command line
        // Allure uses MD5 hash of error message for category grouping
        // Take first line of error message (main error) for category hash
        def errorFirstLine = text.split('\n')[0] ?: text
        def normalizedError = errorFirstLine.trim()
        
        // Write to temp file to avoid shell escaping issues
        def tempFile = "temp_error_${System.currentTimeMillis()}.txt"
        writeFile file: tempFile, text: normalizedError
        
        try {
            def hash = sh(
                script: "md5sum ${tempFile} | cut -d' ' -f1",
                returnStdout: true
            ).trim()
            
            return hash ?: null
        } finally {
            // Clean up temp file
            sh(script: "rm -f ${tempFile}", returnStatus: true)
        }
    } catch (Exception e) {
        echo "WARNING: Error generating MD5 hash: ${e.getMessage()}"
        return null
    }
}

def extractRepoInfoFromPRUrl(prUrl) {
    try {
        if (!prUrl || prUrl.trim() == '') {
            echo "   WARNING: PR URL is empty or null"
            return null
        }
        
        // PR URL format: https://github.com/owner/repo/pull/49
        // or: https://github.com/owner/repo/pull/49/
        def urlPattern = ~/https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/\d+/
        def matcher = prUrl =~ urlPattern
        
        if (matcher) {
            def owner = matcher[0][1]
            def repo = matcher[0][2]
            echo "   Parsed from PR URL: owner=${owner}, repo=${repo}"
            return [owner: owner, repo: repo]
        } else {
            echo "   WARNING: Could not parse PR URL: ${prUrl}"
            echo "   URL pattern expected: https://github.com/owner/repo/pull/XX"
            return null
        }
    } catch (Exception e) {
        echo "   ERROR: Error parsing PR URL: ${e.getMessage()}"
        return null
    }
}