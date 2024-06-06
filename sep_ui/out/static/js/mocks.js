const mock_event = {
  "result": "failed",
  "score": 0,
  "validation_steps": [
    {
      "description": "Verify if the resource with name 'cmtr-be17689b-lambda-test' violates rules",
      "index": 1,
      "meta": {
        "rules": [
          {
            "article": "AWS X-Ray helps to visualize the components of your application, identify performance bottlenecks, and troubleshoot requests that resulted in an error.",
            "description": "Lambda has active tracing disabled",
            "impact": "If active tracing is not enabled it will be harder to debug and operate your functions as the X-Ray service support allows you to rapidly diagnose errors, identify bottlenecks, slowdowns and timeouts, by breaking down the latency for your Lambda functions.",
            "remediation": "To turn on active tracing:\n  1. Open the AWS Lambda console at https://console.aws.amazon.com/lambda/\n  2. Navigate to Functions and then select your Lambda function.\n  3. Choose 'Configuration' and then choose 'Monitoring and operations' tools.\n  4. Choose Edit.\n  5. Under 'AWS X-Ray', toggle on 'Active tracing'.\n  6. Choose Save.",
            "severity": "Low"
          },
          {
            "article": "This control checks function settings for the following runtimes: nodejs18.x,, nodejs16.x, nodejs14.x, nodejs12.x, python3.9, python3.8, python3.7, ruby2.7, java11, java8, java8.al2, go1.x, dotnetcore3.1, and dotnet6.\nLambda runtimes are built around a combination of operating system, programming language, and software libraries that are subject to maintenance and security updates. When a runtime component is no longer supported for security updates, Lambda deprecates the runtime. Even though you cannot create functions that use the deprecated runtime, the function is still available to process invocation events. Make sure that your Lambda functions are current and do not use out-of-date runtime environments.\nIt is strongly recommended that you migrate functions to a supported runtime version so that you continue to receive security patches and remain eligible for technical support.",
            "description": "Lambda functions should not use no longer supported runtimes",
            "impact": "When security updates are no longer available for a component of a runtime, Lambda deprecates the runtime. Because of this, using deprecated Lambda runtimes can pose a security risk. Moreover, functions that use a deprecated runtime are no longer eligible for technical support.",
            "remediation": "To update a function, you need to migrate it to a supported runtime version. \n1. Login to the AWS Management Console and open the Amazon Lambda https://console.aws.amazon.com/lambda/.\n2. In the navigation pane click on the 'Functions'.\n3. Scroll down in the 'Code' tab to the 'Runtime settings' section.\n4. Click 'Edit'.\n5. Select a supported runtime version.\n6. Click 'Save'.",
            "severity": "Info"
          },
          {
            "article": "When lambda functions using the latest version of the implemented runtime environment, functions benefit from new features and enhancements, better security, performance and reliability",
            "description": "Lambda functions not are not using latest runtime environment versions",
            "impact": "Without keeping the Lambda functions runtime up-to-date, it is possible to miss out security patches or other updates. And eventually it will be impossible to update the function.",
            "remediation": "Use AWS CLI to update lambda runtime version:  \naws lambda update-function-configuration --function-name \"function_name\" --runtime \"runtime_version\"",
            "severity": "Medium"
          }
        ],
        "resource_name": "cmtr-be17689b-lambda-test",
        "service": "lambda"
      }
    },
    {
      "description": "Verify if the resource with name 'cmtr-be17689b-s3-test' violates rules",
      "index": 2,
      "meta": {
        "rules": [
          {
            "article": "You can configure a Lambda function to connect to private subnets in a virtual private cloud (VPC) in your AWS account. Use Amazon Virtual Private Cloud (Amazon VPC) to create a private network for resources such as databases, cache instances, or internal services. Connect your function to the VPC to access private resources while the function is running.",
            "description": "Lambda functions are not in a VPC",
            "impact": "Lambda without a VPC is open to the internet. It can increase opportunities for malicious activity such as spamming and Denial-of-Service (DoS) attacks. Also, Lambda without a VPC cannot access AWS resources.",
            "remediation": "1. Open the AWS Lambda console at https://console.aws.amazon.com/lambda/.\n2. Navigate to Functions and then select your Lambda function.\n3. Scroll to Network and then select a VPC with the connectivity requirements of the function.\n4. To run your functions in high availability mode, Security Hub recommends that you choose at least 2 subnets. \n5. Choose at least one security group that has the connectivity requirements of the function \n6. Choose Save.",
            "severity": "Low"
          },
          {
            "article": "For storing sensitive information, you can encrypt environment variable values prior to sending them to Lambda by using the console's encryption helpers. This adds an additional layer of encryption that obscures secret values in the Lambda console and API output, even for users who have permission to use the key. In your code, you retrieve the encrypted value from the environment and decrypt it by using the AWS KMS API.",
            "description": "Lambda environment variables are not encrypted in transit",
            "impact": "Without encrypting environment variable values in transit, there is a possibility of unauthorized access or accidental exposure (in the Lambda console and API output) of sensitive and critical data stored in variables.",
            "remediation": "1. Use the AWS Key Management Service (AWS KMS) to create any customer managed keys for Lambda to use for server-side and client-side encryption. \n2. Login to the AWS Management Console and open the Amazon Lambda https://console.aws.amazon.com/lambda/.\n3. In the navigation pane click on the 'Functions'.\n4. Click on the required function.\n5. Click on the 'Configuration' and then 'Environment variables'.\n6. Click 'Edit'.\n7. Under 'Encryption in transit', choose 'Enable helpers for encryption in transit'.\n8. For each environment variable that you want to enable console encryption helpers for, choose 'Encrypt' next to the environment variable.\n9. Under 'AWS KMS key to encrypt in transit', choose a customer managed key that you created at the beginning of this procedure.\n10. Choose 'Execution role policy' and copy the policy. This policy grants permission to your function's execution role to decrypt the environment variables.\n11. Save this policy to use in the last step of this procedure.\n12. Add code to your function that decrypts the environment variables. Choose 'Decrypt secrets snippet' to see an example.\n13. Click 'Encrypt'.\n14. Choose 'Save'.\n15. Set up permissions. If you're enabling client-side encryption for security in transit, your function needs permission to call the 'kms:Decrypt' API operation. Add the policy that you saved previously in this procedure to the function's execution role.",
            "severity": "Medium"
          }
        ],
        "resource_name": "cmtr-be17689b-s3-test",
        "service": "s3"
      }
    }
  ]
};

const mock_event_str = JSON.stringify(mock_event);

mock_events_data = {
    "items": [
//        {
//            "action": "setup_start_job:failed",
//            "data": {}
//        },
//        {
//           "action": "cleanup:failed",
//           "data": {
//                "log": "",
//                "passed": "failed",
//                "score": 0,
//                "status": null,
//                "unblock_feedback": null
//            }
//        },
        {
            "action": "setup_start_job:succeeded",
            "data": {}
        },
        {
            "action": "setup:began",
            "data": {
                "error_message": "Error occurred: An error occurred (ValidationException) when calling the CreateFunction operation: 1 validation error detected: Value '300000' at 'timeout' failed to satisfy constraint: Member must have value less than or equal to 900"
            }
        },
        {
            "action": "setup:succeeded",
            "data": {
                "result": "failed",
                "score": 0,
                "validation_steps": [
                {
                  "description": "Verify if the resource with name 'cmtr-be17689b-lambda-test' violates rules region",
                  "index": 1,
                  "meta": {
                    "rules": [
                      {
                        "article": "AWS X-Ray helps to visualize...",
                        "description": "Lambda has active tracing disabled",
                        "impact": "If active tracing ...",
                        "remediation": "To turn on active tracing:\n  1. Open the AWS ...",
                        "severity": "Low"
                      },
                      {
                        "article": "This control checks ...",
                        "description": "Lambda functions ...",
                        "impact": "When security ...",
                        "remediation": "To update ...",
                        "severity": "Info"
                      },
                      {
                        "article": "22222222This control checks ...",
                        "description": "Lambda functions ...",
                        "impact": "When security ...",
                        "remediation": "To update ...",
                        "severity": "Info"
                      },
                    ],
                  }
                },
                {
                  "description": "Verify if the resource with name 'cmtr-be17689b-s3-test' violates rules",
                  "index": 2,
                  "meta": {
                    "rules": [
                      {
                        "article": "You can configure ...",
                        "description": "Lambda functions are not in a VPC",
                        "impact": "Lambda without a VPC ...",
                        "remediation": "1. Open the AWS ...\n2. Navigate to Functions and ...",
                        "severity": "Low"
                      },
                      {
                        "article": "For storing sensitive ...",
                        "description": "Lambda environment ...",
                        "impact": "Without encrypting ...",
                        "remediation": "1. Use the ...",
                        "severity": "Medium"
                      },
                    ]
                  }
                },
                ]
            }
        },
//        {
//            "action": "setup:error",
//            "data": {}
//        },
        {
            "action": "verify_start_job:succeeded",
            "data": {}
        },
//        {
//            "action": "verify_start_job:failed",
//            "data": {}
//        },
//         {
//           "action": "cleanup:succeeded",
//           "data": {
//                "log": "s3://epm-cmtr-dev-tf-state/Maksym_Andriienko/AWS/196241772369/iam_assume_role/2024_06_01_111928/pipeline.log",
//                "passed": "failed",
//                "score": 0,
//                "status": null,
//                "unblock_feedback": null
//            }
//          },
        {
            "action": "eval:began",
            "data": {}
        },
        {
            "action": "eval:failed",
            "data": {
                "result": "failed",
                "score": 0,
                "validation_steps": [
                {
                  "description": "Verify if the resource with name 'cmtr-be17689b-lambda-test' violates rules region",
                  "index": 1,
                  "meta": {
                    "rules": [
//                      {
//                        "article": "AWS X-Ray helps to visualize...",
//                        "description": "Lambda has active tracing disabled",
//                        "impact": "If active tracing ...",
//                        "remediation": "To turn on active tracing:\n  1. Open the AWS ...",
//                        "severity": "Low"
//                      },
                    ],
                  }
                },
                {
                  "description": "Verify if the resource with name 'cmtr-be17689b-s3-test' violates rules",
                  "index": 2,
                  "meta": {
                    "rules": [
                      {
                        "article": "For storing sensitive ...",
                        "description": "Lambda environment ...",
                        "impact": "Without encrypting ...",
                        "remediation": "1. Use the ...",
                        "severity": "Medium"
                      },
                    ]
                  }
                },
                ]
            }
        },
//        {
//           "action": "clean_start_job:failed",
//           "data": {}
//        },
//        {
//           "action": "cleanup:failed",
//           "data": {
//                "log": "",
//                "passed": "failed",
//                "score": 0,
//                "status": null,
//                "unblock_feedback": null
//           }
//        },
        {
           "action": "clean_start_job:succeeded",
           "data": {}
        },
        {
            "action": "eval:ready",
            "data": {}
        },
        {
            "action": "eval:succeeded",
            "data": {
                "result": "failed",
                "score": 0,
                "validation_steps": [
                {
                  "description": "Verify if the resource with name 'cmtr-be17689b-lambda-test' violates rules region",
                  "index": 1,
                  "meta": {
                    "rules": [],
                  }
                },
                {
                  "description": "Verify if the resource with name 'cmtr-be17689b-s3-test' violates rules",
                  "index": 2,
                  "meta": {
                    "rules": []
                  }
                },
                ]
            }
        },
        {
           "action": "clean_start_job:succeeded",
           "data": {}
        },
        {
           "action": "cleanup:began",
           "data": {}
        },
        {
           "action": "cleanup:succeeded",
           "data": {
                "log": "s3://epm-cmtr-dev-tf-state/Maksym_Andriienko/AWS/196241772369/iam_assume_role/2024_06_01_111928/pipeline.log",
                "passed": "failed",
                "score": 0,
                "status": null,
                "unblock_feedback": null
           }
        },

    ]
};
