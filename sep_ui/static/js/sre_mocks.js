const setupValidation = {
  "result": null,
  "validation_steps": [
    {
      "description": "Verify if the resource with ID 'cmtr-af96e5bd--s3--test-4062392' in the service 'S3' in the region 'global' violates rules",
      "index": 1,
      "meta": {
        "rules": [
          {
            "article": "By enabling Event Notifications, you receive alerts on your Amazon S3 buckets when specific events occur. For example, you can be notified of object creation, object removal, and object restoration. These notifications can alert relevant teams to accidental or intentional modifications that may lead to unauthorized data access.",
            "description": "S3 buckets should have event notifications enabled",
            "impact": "Not enabling S3 bucket event notifications can lead to slow or no response when specific events occur in your bucket.",
            "remediation": "To enable and configure event notifications for an S3 bucket\n  1. Sign in to the AWS Management Console and open the 'Amazon S3 console' at https://console.aws.amazon.com/s3/.\n  2. In the 'Buckets list', choose the name of the bucket that you want to enable events for.\n  3. Choose 'Properties'.\n  4. Navigate to the 'Event Notifications' section and choose 'Create event notification'.\n  5. In the 'General configuration' section, specify descriptive event name for your event notification. \n    Optionally, you can also specify a prefix and a suffix to limit the notifications to objects with keys ending in the specified characters.\n    a. Enter a description for the 'Event name'.\n    b. (Optional) To filter event notifications by prefix, enter a 'Prefix'.\n    c. (Optional) To filter event notifications by suffix, enter a 'Suffix'.\n  6. In the 'Event types' section, select one or more event types that you want to receive notifications for.\n  7. In the 'Destination' section, choose the event notification destination.\n  Note: Before you can publish event notifications, you must grant the Amazon S3 principal the necessary permissions to call the relevant API. This is so that it can publish notifications to a Lambda function, SNS topic, or SQS queue.\n    a. Select the destination type: Lambda Function, SNS Topic, or SQS Queue.\n    b. After you choose your destination type, choose a function, topic, or queue from the list.\n    c. Or, if you prefer to specify an Amazon Resource Name (ARN), select 'Enter ARN' and enter the ARN.\n  8. Choose 'Save changes', and Amazon S3 sends a test message to the event notification destination.",
            "severity": "Low"
          },
          {
            "article": "At the Amazon S3 bucket level, you can configure permissions through a bucket policy making the objects accessible only through HTTPS.",
            "description": "S3 Bucket Policy allows HTTP requests",
            "impact": "The HTTP protocol is not a secure method of transmitting data. Any person monitoring the Internet traffic can see unencrypted data, which leads to a breach of confidentiality.",
            "remediation": "1. Login to the AWS Management Console and open the Amazon S3 console using  https://console.aws.amazon.com/s3/ .\n2. Select the Check box next to Bucket. \n3. Click on 'Permissions'. \n4. Click on 'Bucket Policy'.\n5. Filling in the required information, add the following to the existing policy: \n{\n  \"Sid\": \"<optional>\",  \n  \"Effect\": \"Deny\",  \n  \"Principal\": \"*\",  \n  \"Action\": \"s3:GetObject\",  \n  \"Resource\": \"arn:aws:s3:::<bucket_name>/*\",  \n  \"Condition\": {\n    \"Bool\": {\n      \"aws:SecureTransport\": \"false\"  \n    }  \n  }  \n} \n6. Save. \n7. Repeat for all the buckets in your AWS account that contain sensitive data.",
            "severity": "High"
          },
          {
            "article": "An S3 Lifecycle configuration is a set of rules that define actions that Amazon S3 applies to a group of objects.\nIt is recommended to configure lifecycle rules on your Amazon S3 bucket as these rules help you define actions that you want Amazon S3 to take during an object's lifetime. Configure their Amazon S3 Lifecycle, to manage your objects so that they are stored cost effectively throughout their lifecycle.",
            "description": "S3 buckets with versioning enabled do not have lifecycle policies configured",
            "impact": "Without the S3 lifecycle configuration when versioning enabled, you are missing out on the opportunity to manage S3 objects so that they are stored cost-effectively throughout their lifecycle by moving data to more economical storage classes over time or expiring data based on the object age.",
            "remediation": "To create a lifecycle rule:\n  1. Sign in to the AWS Management Console and open the Amazon S3 console at https://console.aws.amazon.com/s3/.\n  2. In the 'Buckets' list, choose the name of the bucket that you want to create a lifecycle rule for.\n  3. Choose the 'Management' tab, and choose 'Create lifecycle rule'.\n  4. In 'Lifecycle rule name', enter a name for your rule. The name must be unique within the bucket.\n  5. Choose the scope of the lifecycle rule:\n    - To apply this lifecycle rule to all objects with a specific prefix or tag, choose 'Limit the scope to specific prefixes or tags'.\n      - To limit the scope by prefix, in 'Prefix', enter the prefix.\n      - To limit the scope by tag, choose 'Add tag', and enter the tag key and value.\n    - To apply this lifecycle rule to all objects in the bucket, choose 'This rule applies to all objects in the bucket', and choose 'I acknowledge that this rule applies to all objects in the bucket'.\n  6. To filter a rule by object size, you can check 'Specify minimum object size, Specify maximum object size', or both options.\n    - When you're specifying a 'minimum object' size or 'maximum object size', the value must be larger than 0 bytes and up to 5TB. You can specify this value in bytes, KB, MB, or GB.\n    - When you're specifying both, the maximum object size must be larger than the minimum object size.\n  7. Under Lifecycle rule actions, choose the actions that you want your lifecycle rule to perform:\n    - Transition current versions of objects between storage classes\n    - Transition previous versions of objects between storage classes\n    - Expire current versions of objects\n    - Permanently delete previous versions of objects\n    - Delete expired delete markers or incomplete multipart uploads\n    Depending on the actions that you choose, different options appear.\n  8. To transition current versions of objects between storage classes, under 'Transition current versions of objects between storage classes':\n    a. In 'Storage class transitions', choose the storage class to transition to:\n      - Standard-IA\n      - Intelligent-Tiering\n      - One Zone-IA\n      - S3 Glacier Flexible Retrieval\n      - Glacier Deep Archive\n    b. In 'Days after object creation', enter the number of days after creation to transition the object.\n    ! Important:\n      When you choose the S3 Glacier Flexible Retrieval or Glacier Deep Archive storage class, your objects remain in Amazon S3. You cannot access them directly through the separate Amazon S3 Glacier service.\n  9. To transition non-current versions of objects between storage classes, under 'Transition non-current versions of objects between storage classes':\n    a. In 'Storage class transitions', choose the storage class to transition to:\n      - Standard-IA\n      - Intelligent-Tiering\n      - One Zone-IA\n      - S3 Glacier Flexible Retrieval\n      - Glacier Deep Archive\n    b. In Days after object becomes non-current, enter the number of days after creation to transition the object.\n  10. To expire current versions of objects, under 'Expire previous versions of objects', in 'Number of days after object creation', enter the number of days.\n  ! Important:\n    In a non-versioned bucket the expiration action results in Amazon S3 permanently removing the object.\n  11. To permanently delete previous versions of objects, under 'Permanently delete noncurrent versions of objects', in 'Days after objects become noncurrent', enter the number of days. You can optionally specify the number of newer versions to retain by entering a value under 'Number of newer versions to retain'.\n  12. Under 'Delete expired delete markers or incomplete multipart uploads', choose' Delete expired object delete markers' and 'Delete incomplete multipart uploads'. Then, enter the number of days after the multipart upload initiation that you want to end and clean up incomplete multipart uploads.\n  13. Choose 'Create rule'.\n      If the rule does not contain any errors, Amazon S3 enables it, and you can see it on the 'Management' tab under 'Lifecycle rules'.",
            "severity": "Info"
          }
        ]
      }
    },
    {
      "description": "Verify 2",
      "index": 2,
      "meta": {
        "rules": [
          {
            "article": "By enabling Event Notifications, you receive alerts on your Amazon S3 buckets when specific events occur. For example, you can be notified of object creation, object removal, and object restoration. These notifications can alert relevant teams to accidental or intentional modifications that may lead to unauthorized data access.",
            "description": "S3 buckets should have event notifications enabled",
            "impact": "Not enabling S3 bucket event notifications can lead to slow or no response when specific events occur in your bucket.",
            "remediation": "To enable and configure event notifications for an S3 bucket\n  1. Sign in to the AWS Management Console and open the 'Amazon S3 console' at https://console.aws.amazon.com/s3/.\n  2. In the 'Buckets list', choose the name of the bucket that you want to enable events for.\n  3. Choose 'Properties'.\n  4. Navigate to the 'Event Notifications' section and choose 'Create event notification'.\n  5. In the 'General configuration' section, specify descriptive event name for your event notification. \n    Optionally, you can also specify a prefix and a suffix to limit the notifications to objects with keys ending in the specified characters.\n    a. Enter a description for the 'Event name'.\n    b. (Optional) To filter event notifications by prefix, enter a 'Prefix'.\n    c. (Optional) To filter event notifications by suffix, enter a 'Suffix'.\n  6. In the 'Event types' section, select one or more event types that you want to receive notifications for.\n  7. In the 'Destination' section, choose the event notification destination.\n  Note: Before you can publish event notifications, you must grant the Amazon S3 principal the necessary permissions to call the relevant API. This is so that it can publish notifications to a Lambda function, SNS topic, or SQS queue.\n    a. Select the destination type: Lambda Function, SNS Topic, or SQS Queue.\n    b. After you choose your destination type, choose a function, topic, or queue from the list.\n    c. Or, if you prefer to specify an Amazon Resource Name (ARN), select 'Enter ARN' and enter the ARN.\n  8. Choose 'Save changes', and Amazon S3 sends a test message to the event notification destination.",
            "severity": "Low"
          },
          {
            "article": "At the Amazon S3 bucket level, you can configure permissions through a bucket policy making the objects accessible only through HTTPS.",
            "description": "S3 Bucket Policy allows HTTP requests",
            "impact": "The HTTP protocol is not a secure method of transmitting data. Any person monitoring the Internet traffic can see unencrypted data, which leads to a breach of confidentiality.",
            "remediation": "1. Login to the AWS Management Console and open the Amazon S3 console using  https://console.aws.amazon.com/s3/ .\n2. Select the Check box next to Bucket. \n3. Click on 'Permissions'. \n4. Click on 'Bucket Policy'.\n5. Filling in the required information, add the following to the existing policy: \n{\n  \"Sid\": \"<optional>\",  \n  \"Effect\": \"Deny\",  \n  \"Principal\": \"*\",  \n  \"Action\": \"s3:GetObject\",  \n  \"Resource\": \"arn:aws:s3:::<bucket_name>/*\",  \n  \"Condition\": {\n    \"Bool\": {\n      \"aws:SecureTransport\": \"false\"  \n    }  \n  }  \n} \n6. Save. \n7. Repeat for all the buckets in your AWS account that contain sensitive data.",
            "severity": "High"
          },
          {
            "article": "An S3 Lifecycle configuration is a set of rules that define actions that Amazon S3 applies to a group of objects.\nIt is recommended to configure lifecycle rules on your Amazon S3 bucket as these rules help you define actions that you want Amazon S3 to take during an object's lifetime. Configure their Amazon S3 Lifecycle, to manage your objects so that they are stored cost effectively throughout their lifecycle.",
            "description": "S3 buckets with versioning enabled do not have lifecycle policies configured",
            "impact": "Without the S3 lifecycle configuration when versioning enabled, you are missing out on the opportunity to manage S3 objects so that they are stored cost-effectively throughout their lifecycle by moving data to more economical storage classes over time or expiring data based on the object age.",
            "remediation": "To create a lifecycle rule:\n  1. Sign in to the AWS Management Console and open the Amazon S3 console at https://console.aws.amazon.com/s3/.\n  2. In the 'Buckets' list, choose the name of the bucket that you want to create a lifecycle rule for.\n  3. Choose the 'Management' tab, and choose 'Create lifecycle rule'.\n  4. In 'Lifecycle rule name', enter a name for your rule. The name must be unique within the bucket.\n  5. Choose the scope of the lifecycle rule:\n    - To apply this lifecycle rule to all objects with a specific prefix or tag, choose 'Limit the scope to specific prefixes or tags'.\n      - To limit the scope by prefix, in 'Prefix', enter the prefix.\n      - To limit the scope by tag, choose 'Add tag', and enter the tag key and value.\n    - To apply this lifecycle rule to all objects in the bucket, choose 'This rule applies to all objects in the bucket', and choose 'I acknowledge that this rule applies to all objects in the bucket'.\n  6. To filter a rule by object size, you can check 'Specify minimum object size, Specify maximum object size', or both options.\n    - When you're specifying a 'minimum object' size or 'maximum object size', the value must be larger than 0 bytes and up to 5TB. You can specify this value in bytes, KB, MB, or GB.\n    - When you're specifying both, the maximum object size must be larger than the minimum object size.\n  7. Under Lifecycle rule actions, choose the actions that you want your lifecycle rule to perform:\n    - Transition current versions of objects between storage classes\n    - Transition previous versions of objects between storage classes\n    - Expire current versions of objects\n    - Permanently delete previous versions of objects\n    - Delete expired delete markers or incomplete multipart uploads\n    Depending on the actions that you choose, different options appear.\n  8. To transition current versions of objects between storage classes, under 'Transition current versions of objects between storage classes':\n    a. In 'Storage class transitions', choose the storage class to transition to:\n      - Standard-IA\n      - Intelligent-Tiering\n      - One Zone-IA\n      - S3 Glacier Flexible Retrieval\n      - Glacier Deep Archive\n    b. In 'Days after object creation', enter the number of days after creation to transition the object.\n    ! Important:\n      When you choose the S3 Glacier Flexible Retrieval or Glacier Deep Archive storage class, your objects remain in Amazon S3. You cannot access them directly through the separate Amazon S3 Glacier service.\n  9. To transition non-current versions of objects between storage classes, under 'Transition non-current versions of objects between storage classes':\n    a. In 'Storage class transitions', choose the storage class to transition to:\n      - Standard-IA\n      - Intelligent-Tiering\n      - One Zone-IA\n      - S3 Glacier Flexible Retrieval\n      - Glacier Deep Archive\n    b. In Days after object becomes non-current, enter the number of days after creation to transition the object.\n  10. To expire current versions of objects, under 'Expire previous versions of objects', in 'Number of days after object creation', enter the number of days.\n  ! Important:\n    In a non-versioned bucket the expiration action results in Amazon S3 permanently removing the object.\n  11. To permanently delete previous versions of objects, under 'Permanently delete noncurrent versions of objects', in 'Days after objects become noncurrent', enter the number of days. You can optionally specify the number of newer versions to retain by entering a value under 'Number of newer versions to retain'.\n  12. Under 'Delete expired delete markers or incomplete multipart uploads', choose' Delete expired object delete markers' and 'Delete incomplete multipart uploads'. Then, enter the number of days after the multipart upload initiation that you want to end and clean up incomplete multipart uploads.\n  13. Choose 'Create rule'.\n      If the rule does not contain any errors, Amazon S3 enables it, and you can see it on the 'Management' tab under 'Lifecycle rules'.",
            "severity": "Info"
          }
        ]
      }
    }
  ]
}

const evalFailedValidation = {
  "result": "failed",
  "score": 0,
  "steps_passed_ratio": null,
  "validation_steps": [
    {
      "description": "Verify if the resource with ID 'cmtr-af96e5bd--s3--test-4062392' in the service 'S3' in the region 'global' violates rules",
      "index": 1,
      "meta": {
        "rules": [
          {
            "article": "By enabling Event Notifications, you receive alerts on your Amazon S3 buckets when specific events occur. For example, you can be notified of object creation, object removal, and object restoration. These notifications can alert relevant teams to accidental or intentional modifications that may lead to unauthorized data access.",
            "description": "S3 buckets should have event notifications enabled",
            "impact": "Not enabling S3 bucket event notifications can lead to slow or no response when specific events occur in your bucket.",
            "remediation": "To enable and configure event notifications for an S3 bucket\n  1. Sign in to the AWS Management Console and open the 'Amazon S3 console' at https://console.aws.amazon.com/s3/.\n  2. In the 'Buckets list', choose the name of the bucket that you want to enable events for.\n  3. Choose 'Properties'.\n  4. Navigate to the 'Event Notifications' section and choose 'Create event notification'.\n  5. In the 'General configuration' section, specify descriptive event name for your event notification. \n    Optionally, you can also specify a prefix and a suffix to limit the notifications to objects with keys ending in the specified characters.\n    a. Enter a description for the 'Event name'.\n    b. (Optional) To filter event notifications by prefix, enter a 'Prefix'.\n    c. (Optional) To filter event notifications by suffix, enter a 'Suffix'.\n  6. In the 'Event types' section, select one or more event types that you want to receive notifications for.\n  7. In the 'Destination' section, choose the event notification destination.\n  Note: Before you can publish event notifications, you must grant the Amazon S3 principal the necessary permissions to call the relevant API. This is so that it can publish notifications to a Lambda function, SNS topic, or SQS queue.\n    a. Select the destination type: Lambda Function, SNS Topic, or SQS Queue.\n    b. After you choose your destination type, choose a function, topic, or queue from the list.\n    c. Or, if you prefer to specify an Amazon Resource Name (ARN), select 'Enter ARN' and enter the ARN.\n  8. Choose 'Save changes', and Amazon S3 sends a test message to the event notification destination.",
            "severity": "Low"
          },
          {
            "article": "An S3 Lifecycle configuration is a set of rules that define actions that Amazon S3 applies to a group of objects.\nIt is recommended to configure lifecycle rules on your Amazon S3 bucket as these rules help you define actions that you want Amazon S3 to take during an object's lifetime. Configure their Amazon S3 Lifecycle, to manage your objects so that they are stored cost effectively throughout their lifecycle.",
            "description": "S3 buckets with versioning enabled do not have lifecycle policies configured",
            "impact": "Without the S3 lifecycle configuration when versioning enabled, you are missing out on the opportunity to manage S3 objects so that they are stored cost-effectively throughout their lifecycle by moving data to more economical storage classes over time or expiring data based on the object age.",
            "remediation": "To create a lifecycle rule:\n  1. Sign in to the AWS Management Console and open the Amazon S3 console at https://console.aws.amazon.com/s3/.\n  2. In the 'Buckets' list, choose the name of the bucket that you want to create a lifecycle rule for.\n  3. Choose the 'Management' tab, and choose 'Create lifecycle rule'.\n  4. In 'Lifecycle rule name', enter a name for your rule. The name must be unique within the bucket.\n  5. Choose the scope of the lifecycle rule:\n    - To apply this lifecycle rule to all objects with a specific prefix or tag, choose 'Limit the scope to specific prefixes or tags'.\n      - To limit the scope by prefix, in 'Prefix', enter the prefix.\n      - To limit the scope by tag, choose 'Add tag', and enter the tag key and value.\n    - To apply this lifecycle rule to all objects in the bucket, choose 'This rule applies to all objects in the bucket', and choose 'I acknowledge that this rule applies to all objects in the bucket'.\n  6. To filter a rule by object size, you can check 'Specify minimum object size, Specify maximum object size', or both options.\n    - When you're specifying a 'minimum object' size or 'maximum object size', the value must be larger than 0 bytes and up to 5TB. You can specify this value in bytes, KB, MB, or GB.\n    - When you're specifying both, the maximum object size must be larger than the minimum object size.\n  7. Under Lifecycle rule actions, choose the actions that you want your lifecycle rule to perform:\n    - Transition current versions of objects between storage classes\n    - Transition previous versions of objects between storage classes\n    - Expire current versions of objects\n    - Permanently delete previous versions of objects\n    - Delete expired delete markers or incomplete multipart uploads\n    Depending on the actions that you choose, different options appear.\n  8. To transition current versions of objects between storage classes, under 'Transition current versions of objects between storage classes':\n    a. In 'Storage class transitions', choose the storage class to transition to:\n      - Standard-IA\n      - Intelligent-Tiering\n      - One Zone-IA\n      - S3 Glacier Flexible Retrieval\n      - Glacier Deep Archive\n    b. In 'Days after object creation', enter the number of days after creation to transition the object.\n    ! Important:\n      When you choose the S3 Glacier Flexible Retrieval or Glacier Deep Archive storage class, your objects remain in Amazon S3. You cannot access them directly through the separate Amazon S3 Glacier service.\n  9. To transition non-current versions of objects between storage classes, under 'Transition non-current versions of objects between storage classes':\n    a. In 'Storage class transitions', choose the storage class to transition to:\n      - Standard-IA\n      - Intelligent-Tiering\n      - One Zone-IA\n      - S3 Glacier Flexible Retrieval\n      - Glacier Deep Archive\n    b. In Days after object becomes non-current, enter the number of days after creation to transition the object.\n  10. To expire current versions of objects, under 'Expire previous versions of objects', in 'Number of days after object creation', enter the number of days.\n  ! Important:\n    In a non-versioned bucket the expiration action results in Amazon S3 permanently removing the object.\n  11. To permanently delete previous versions of objects, under 'Permanently delete noncurrent versions of objects', in 'Days after objects become noncurrent', enter the number of days. You can optionally specify the number of newer versions to retain by entering a value under 'Number of newer versions to retain'.\n  12. Under 'Delete expired delete markers or incomplete multipart uploads', choose' Delete expired object delete markers' and 'Delete incomplete multipart uploads'. Then, enter the number of days after the multipart upload initiation that you want to end and clean up incomplete multipart uploads.\n  13. Choose 'Create rule'.\n      If the rule does not contain any errors, Amazon S3 enables it, and you can see it on the 'Management' tab under 'Lifecycle rules'.",
            "severity": "Info"
          },
          {
            "article": "At the Amazon S3 bucket level, you can configure permissions through a bucket policy making the objects accessible only through HTTPS.",
            "description": "S3 Bucket Policy allows HTTP requests",
            "impact": "The HTTP protocol is not a secure method of transmitting data. Any person monitoring the Internet traffic can see unencrypted data, which leads to a breach of confidentiality.",
            "remediation": "1. Login to the AWS Management Console and open the Amazon S3 console using  https://console.aws.amazon.com/s3/ .\n2. Select the Check box next to Bucket. \n3. Click on 'Permissions'. \n4. Click on 'Bucket Policy'.\n5. Filling in the required information, add the following to the existing policy: \n{\n  \"Sid\": \"<optional>\",  \n  \"Effect\": \"Deny\",  \n  \"Principal\": \"*\",  \n  \"Action\": \"s3:GetObject\",  \n  \"Resource\": \"arn:aws:s3:::<bucket_name>/*\",  \n  \"Condition\": {\n    \"Bool\": {\n      \"aws:SecureTransport\": \"false\"  \n    }  \n  }  \n} \n6. Save. \n7. Repeat for all the buckets in your AWS account that contain sensitive data.",
            "severity": "High"
          }
        ]
      },
      "step_passed": false
    }
  ]
}

const evalFailedNewViolationAdded = {
  "result": "failed",
  "score": 0,
  "steps_passed_ratio": null,
  "validation_steps": [
    {
      "description": "Verify if the resource with ID 'cmtr-af96e5bd--s3--test-4062392' in the service 'S3' in the region 'global' violates rules",
      "index": 1,
      "meta": {
        "rules": [
           {
            "article": "By enabling Event Notifications, you receive alerts on your Amazon S3 buckets when specific events occur. For example, you can be notified of object creation, object removal, and object restoration. These notifications can alert relevant teams to accidental or intentional modifications that may lead to unauthorized data access.",
            "description": "S3 buckets should have event notifications enabled",
            "impact": "Not enabling S3 bucket event notifications can lead to slow or no response when specific events occur in your bucket.",
            "remediation": "To enable and configure event notifications for an S3 bucket\n  1. Sign in to the AWS Management Console and open the 'Amazon S3 console' at https://console.aws.amazon.com/s3/.\n  2. In the 'Buckets list', choose the name of the bucket that you want to enable events for.\n  3. Choose 'Properties'.\n  4. Navigate to the 'Event Notifications' section and choose 'Create event notification'.\n  5. In the 'General configuration' section, specify descriptive event name for your event notification. \n    Optionally, you can also specify a prefix and a suffix to limit the notifications to objects with keys ending in the specified characters.\n    a. Enter a description for the 'Event name'.\n    b. (Optional) To filter event notifications by prefix, enter a 'Prefix'.\n    c. (Optional) To filter event notifications by suffix, enter a 'Suffix'.\n  6. In the 'Event types' section, select one or more event types that you want to receive notifications for.\n  7. In the 'Destination' section, choose the event notification destination.\n  Note: Before you can publish event notifications, you must grant the Amazon S3 principal the necessary permissions to call the relevant API. This is so that it can publish notifications to a Lambda function, SNS topic, or SQS queue.\n    a. Select the destination type: Lambda Function, SNS Topic, or SQS Queue.\n    b. After you choose your destination type, choose a function, topic, or queue from the list.\n    c. Or, if you prefer to specify an Amazon Resource Name (ARN), select 'Enter ARN' and enter the ARN.\n  8. Choose 'Save changes', and Amazon S3 sends a test message to the event notification destination.",
            "severity": "Low"
          },
          {
            "article": "New violation article",
            "description": "New violation description",
            "impact": "New violation impact",
            "remediation": "New violation impact",
            "severity": "Low"
          },
          {
            "article": "2 article",
            "description": "2 description",
            "impact": "2 violation impact",
            "remediation": "2 violation impact",
            "severity": "Low"
          },
        ]
      },
      "step_passed": false
    },
    {
      "description": "Verify 3",
      "index": 2,
      "meta": {
        "rules": [
          {
            "article": "New violation 2 article",
            "description": "New violation 2 description",
            "impact": "New violation 2 impact",
            "remediation": "New violation 2 impact",
            "severity": "Low"
          },
          {
            "article": "At the Amazon S3 bucket level, you can configure permissions through a bucket policy making the objects accessible only through HTTPS.",
            "description": "S3 Bucket Policy allows HTTP requests",
            "impact": "The HTTP protocol is not a secure method of transmitting data. Any person monitoring the Internet traffic can see unencrypted data, which leads to a breach of confidentiality.",
            "remediation": "1. Login to the AWS Management Console and open the Amazon S3 console using  https://console.aws.amazon.com/s3/ .\n2. Select the Check box next to Bucket. \n3. Click on 'Permissions'. \n4. Click on 'Bucket Policy'.\n5. Filling in the required information, add the following to the existing policy: \n{\n  \"Sid\": \"<optional>\",  \n  \"Effect\": \"Deny\",  \n  \"Principal\": \"*\",  \n  \"Action\": \"s3:GetObject\",  \n  \"Resource\": \"arn:aws:s3:::<bucket_name>/*\",  \n  \"Condition\": {\n    \"Bool\": {\n      \"aws:SecureTransport\": \"false\"  \n    }  \n  }  \n} \n6. Save. \n7. Repeat for all the buckets in your AWS account that contain sensitive data.",
            "severity": "High"
          }
        ]
      }
    },
    {
      "description": "Verify 4",
      "index": 3,
      "meta": {
        "rules": [
          {
            "article": "New violation 2 article",
            "description": "New violation 2 description",
            "impact": "New violation 2 impact",
            "remediation": "New violation 2 impact",
            "severity": "Low"
          },
          {
            "article": "At the Amazon S3 bucket level, you can configure permissions through a bucket policy making the objects accessible only through HTTPS.",
            "description": "S3 Bucket Policy allows HTTP requests",
            "impact": "The HTTP protocol is not a secure method of transmitting data. Any person monitoring the Internet traffic can see unencrypted data, which leads to a breach of confidentiality.",
            "remediation": "1. Login to the AWS Management Console and open the Amazon S3 console using  https://console.aws.amazon.com/s3/ .\n2. Select the Check box next to Bucket. \n3. Click on 'Permissions'. \n4. Click on 'Bucket Policy'.\n5. Filling in the required information, add the following to the existing policy: \n{\n  \"Sid\": \"<optional>\",  \n  \"Effect\": \"Deny\",  \n  \"Principal\": \"*\",  \n  \"Action\": \"s3:GetObject\",  \n  \"Resource\": \"arn:aws:s3:::<bucket_name>/*\",  \n  \"Condition\": {\n    \"Bool\": {\n      \"aws:SecureTransport\": \"false\"  \n    }  \n  }  \n} \n6. Save. \n7. Repeat for all the buckets in your AWS account that contain sensitive data.",
            "severity": "High"
          }
        ]
      }
    }
  ]
}

const evalFailedNewViolationAdded2 = {
  "result": "failed",
  "score": 0,
  "steps_passed_ratio": null,
  "validation_steps": [
    {
      "description": "Verify if the resource with ID 'cmtr-af96e5bd--s3--test-4062392' in the service 'S3' in the region 'global' violates rules",
      "index": 1,
      "meta": {
        "rules": [
          {
            "article": "New violation article",
            "description": "New violation description",
            "impact": "New violation impact",
            "remediation": "New violation impact",
            "severity": "Low"
          },
          {
            "article": "3 article",
            "description": "3 description",
            "impact": "3 violation impact",
            "remediation": "3 violation impact",
            "severity": "Low"
          },
          {
            "article": "4 article",
            "description": "4 description",
            "impact": "4 violation impact",
            "remediation": "4 violation impact",
            "severity": "Low"
          },
          {
            "article": "5 article",
            "description": "5 description",
            "impact": "5 violation impact",
            "remediation": "5 violation impact",
            "severity": "Low"
          },
          {
            "article": "5 article",
            "description": "5 description",
            "impact": "5 violation impact",
            "remediation": "5 violation impact",
            "severity": "Low"
          },
        ]
      },
      "step_passed": false
    },
    {
      "description": "Verify 3",
      "index": 2,
      "meta": {
        "rules": [
          {
            "article": "New violation 2 article",
            "description": "New violation 2 description",
            "impact": "New violation 2 impact",
            "remediation": "New violation 2 impact",
            "severity": "Low"
          },
          {
            "article": "At the Amazon S3 bucket level, you can configure permissions through a bucket policy making the objects accessible only through HTTPS.",
            "description": "S3 Bucket Policy allows HTTP requests",
            "impact": "The HTTP protocol is not a secure method of transmitting data. Any person monitoring the Internet traffic can see unencrypted data, which leads to a breach of confidentiality.",
            "remediation": "1. Login to the AWS Management Console and open the Amazon S3 console using  https://console.aws.amazon.com/s3/ .\n2. Select the Check box next to Bucket. \n3. Click on 'Permissions'. \n4. Click on 'Bucket Policy'.\n5. Filling in the required information, add the following to the existing policy: \n{\n  \"Sid\": \"<optional>\",  \n  \"Effect\": \"Deny\",  \n  \"Principal\": \"*\",  \n  \"Action\": \"s3:GetObject\",  \n  \"Resource\": \"arn:aws:s3:::<bucket_name>/*\",  \n  \"Condition\": {\n    \"Bool\": {\n      \"aws:SecureTransport\": \"false\"  \n    }  \n  }  \n} \n6. Save. \n7. Repeat for all the buckets in your AWS account that contain sensitive data.",
            "severity": "High"
          }
        ]
      }
    }
  ]
}

const setupValidationString = JSON.stringify(setupValidation);
const evalFailedValidationString = JSON.stringify(evalFailedValidation);
const evalFailedNewViolationAddedString = JSON.stringify(evalFailedNewViolationAdded);
const evalFailedNewViolationAddedString2 = JSON.stringify(evalFailedNewViolationAdded2);

// mock_events_sre_data all events
mock_events_sre_data0 = {
    "items": [
//        {
//            "action": "setup_start_job:failed",
//            "data": {}
//        },
        {
            "action": "setup_start_job:succeeded",
            "data": {}
        },
        {
            "action": "setup:began",
            "data": {}
        },
        {
            "action": "setup:succeeded",
            "data": {
                "definition": {
                    "content": "{\"aws_region\": \"eu-central-1\", \"bucket_owner\": \"196241772369\", \"s3_arn\": \"arn:aws:s3:::cmtr-af96e5bd--s3--test-6645991\", \"s3_confidential_object_1\": \"customers_info_PII.csv\", \"s3_id\": \"cmtr-af96e5bd--s3--test-6645991\", \"sns_topic_arn\": \"arn:aws:sns:eu-central-1:196241772369:cmtr-af96e5bd--sns--test\", \"sns_topic_name\": \"cmtr-af96e5bd--sns--test\"}"
                },
                "validation": "{\n  \"result\": null,\n  \"validation_steps\": [\n    {\n      \"description\": \"Verify if the resource named 'cmtr-af96e5bd--s3--test-645335' in the service 'S3' in the region 'global' violates rules\",\n      \"index\": 1,\n      \"meta\": {\n        \"rules\": [\n          {\n            \"article\": \"At the Amazon S3 bucket level, you can configure permissions through a bucket policy making the objects accessible only through HTTPS.\",\n            \"description\": \"S3 Bucket Policy allows HTTP requests\",\n            \"impact\": \"The HTTP protocol is not a secure method of transmitting data. Any person monitoring the Internet traffic can see unencrypted data, which leads to a breach of confidentiality.\",\n            \"remediation\": \"1. Login to the AWS Management Console and open the Amazon S3 console using  https://console.aws.amazon.com/s3/ .\\n2. Select the Check box next to Bucket. \\n3. Click on 'Permissions'. \\n4. Click on 'Bucket Policy'.\\n5. Filling in the required information, add the following to the existing policy: \\n{\\n  \\\"Sid\\\": \\\"<optional>\\\",  \\n  \\\"Effect\\\": \\\"Deny\\\",  \\n  \\\"Principal\\\": \\\"*\\\",  \\n  \\\"Action\\\": \\\"s3:GetObject\\\",  \\n  \\\"Resource\\\": \\\"arn:aws:s3:::<bucket_name>/*\\\",  \\n  \\\"Condition\\\": {\\n    \\\"Bool\\\": {\\n      \\\"aws:SecureTransport\\\": \\\"false\\\"  \\n    }  \\n  }  \\n} \\n6. Save. \\n7. Repeat for all the buckets in your AWS account that contain sensitive data.\",\n            \"severity\": \"High\"\n          },\n          {\n            \"article\": \"An S3 Lifecycle configuration is a set of rules that define actions that Amazon S3 applies to a group of objects.\\nIt is recommended to configure lifecycle rules on your Amazon S3 bucket as these rules help you define actions that you want Amazon S3 to take during an object's lifetime. Configure their Amazon S3 Lifecycle, to manage your objects so that they are stored cost effectively throughout their lifecycle.\",\n            \"description\": \"S3 buckets with versioning enabled do not have lifecycle policies configured\",\n            \"impact\": \"Without the S3 lifecycle configuration when versioning enabled, you are missing out on the opportunity to manage S3 objects so that they are stored cost-effectively throughout their lifecycle by moving data to more economical storage classes over time or expiring data based on the object age.\",\n            \"remediation\": \"To create a lifecycle rule:\\n  1. Sign in to the AWS Management Console and open the Amazon S3 console at https://console.aws.amazon.com/s3/.\\n  2. In the 'Buckets' list, choose the name of the bucket that you want to create a lifecycle rule for.\\n  3. Choose the 'Management' tab, and choose 'Create lifecycle rule'.\\n  4. In 'Lifecycle rule name', enter a name for your rule. The name must be unique within the bucket.\\n  5. Choose the scope of the lifecycle rule:\\n    - To apply this lifecycle rule to all objects with a specific prefix or tag, choose 'Limit the scope to specific prefixes or tags'.\\n      - To limit the scope by prefix, in 'Prefix', enter the prefix.\\n      - To limit the scope by tag, choose 'Add tag', and enter the tag key and value.\\n    - To apply this lifecycle rule to all objects in the bucket, choose 'This rule applies to all objects in the bucket', and choose 'I acknowledge that this rule applies to all objects in the bucket'.\\n  6. To filter a rule by object size, you can check 'Specify minimum object size, Specify maximum object size', or both options.\\n    - When you're specifying a 'minimum object' size or 'maximum object size', the value must be larger than 0 bytes and up to 5TB. You can specify this value in bytes, KB, MB, or GB.\\n    - When you're specifying both, the maximum object size must be larger than the minimum object size.\\n  7. Under Lifecycle rule actions, choose the actions that you want your lifecycle rule to perform:\\n    - Transition current versions of objects between storage classes\\n    - Transition previous versions of objects between storage classes\\n    - Expire current versions of objects\\n    - Permanently delete previous versions of objects\\n    - Delete expired delete markers or incomplete multipart uploads\\n    Depending on the actions that you choose, different options appear.\\n  8. To transition current versions of objects between storage classes, under 'Transition current versions of objects between storage classes':\\n    a. In 'Storage class transitions', choose the storage class to transition to:\\n      - Standard-IA\\n      - Intelligent-Tiering\\n      - One Zone-IA\\n      - S3 Glacier Flexible Retrieval\\n      - Glacier Deep Archive\\n    b. In 'Days after object creation', enter the number of days after creation to transition the object.\\n    ! Important:\\n      When you choose the S3 Glacier Flexible Retrieval or Glacier Deep Archive storage class, your objects remain in Amazon S3. You cannot access them directly through the separate Amazon S3 Glacier service.\\n  9. To transition non-current versions of objects between storage classes, under 'Transition non-current versions of objects between storage classes':\\n    a. In 'Storage class transitions', choose the storage class to transition to:\\n      - Standard-IA\\n      - Intelligent-Tiering\\n      - One Zone-IA\\n      - S3 Glacier Flexible Retrieval\\n      - Glacier Deep Archive\\n    b. In Days after object becomes non-current, enter the number of days after creation to transition the object.\\n  10. To expire current versions of objects, under 'Expire previous versions of objects', in 'Number of days after object creation', enter the number of days.\\n  ! Important:\\n    In a non-versioned bucket the expiration action results in Amazon S3 permanently removing the object.\\n  11. To permanently delete previous versions of objects, under 'Permanently delete noncurrent versions of objects', in 'Days after objects become noncurrent', enter the number of days. You can optionally specify the number of newer versions to retain by entering a value under 'Number of newer versions to retain'.\\n  12. Under 'Delete expired delete markers or incomplete multipart uploads', choose' Delete expired object delete markers' and 'Delete incomplete multipart uploads'. Then, enter the number of days after the multipart upload initiation that you want to end and clean up incomplete multipart uploads.\\n  13. Choose 'Create rule'.\\n      If the rule does not contain any errors, Amazon S3 enables it, and you can see it on the 'Management' tab under 'Lifecycle rules'.\",\n            \"severity\": \"Info\"\n          },\n          {\n            \"article\": \"By enabling Event Notifications, you receive alerts on your Amazon S3 buckets when specific events occur. For example, you can be notified of object creation, object removal, and object restoration. These notifications can alert relevant teams to accidental or intentional modifications that may lead to unauthorized data access.\",\n            \"description\": \"S3 buckets should have event notifications enabled\",\n            \"impact\": \"Not enabling S3 bucket event notifications can lead to slow or no response when specific events occur in your bucket.\",\n            \"remediation\": \"To enable and configure event notifications for an S3 bucket\\n  1. Sign in to the AWS Management Console and open the 'Amazon S3 console' at https://console.aws.amazon.com/s3/.\\n  2. In the 'Buckets list', choose the name of the bucket that you want to enable events for.\\n  3. Choose 'Properties'.\\n  4. Navigate to the 'Event Notifications' section and choose 'Create event notification'.\\n  5. In the 'General configuration' section, specify descriptive event name for your event notification. \\n    Optionally, you can also specify a prefix and a suffix to limit the notifications to objects with keys ending in the specified characters.\\n    a. Enter a description for the 'Event name'.\\n    b. (Optional) To filter event notifications by prefix, enter a 'Prefix'.\\n    c. (Optional) To filter event notifications by suffix, enter a 'Suffix'.\\n  6. In the 'Event types' section, select one or more event types that you want to receive notifications for.\\n  7. In the 'Destination' section, choose the event notification destination.\\n  Note: Before you can publish event notifications, you must grant the Amazon S3 principal the necessary permissions to call the relevant API. This is so that it can publish notifications to a Lambda function, SNS topic, or SQS queue.\\n    a. Select the destination type: Lambda Function, SNS Topic, or SQS Queue.\\n    b. After you choose your destination type, choose a function, topic, or queue from the list.\\n    c. Or, if you prefer to specify an Amazon Resource Name (ARN), select 'Enter ARN' and enter the ARN.\\n  8. Choose 'Save changes', and Amazon S3 sends a test message to the event notification destination.\",\n            \"severity\": \"Low\"\n          }\n        ]\n      }\n    }\n  ]\n}"
            }
        },
//        {
//            "action": "setup:error",
//            "data": {}
//        },
        {
            "action": "eval:ready",
            "data": {}
        },
//        {
//            "action": "verify_start_job:succeeded",
//            "data": {}
//        },
//        {
//            "action": "verify_start_job:failed",
//            "data": {}
//        },
//        {
//            "action": "eval:began",
//            "data": {}
//        },
//        {
//            "action": "eval:failed",
//            "data": {
//                "score": 0,
//                "steps_passed_ratio": null,
//                "validation": "{\n  \"result\": \"failed\",\n  \"score\": 0,\n  \"steps_passed_ratio\": null,\n  \"validation_steps\": [\n    {\n      \"description\": \"Verify if the resource with ID 'cmtr-af96e5bd--s3--test-6645991' in the service 'S3' in the region 'global' violates rules\",\n      \"index\": 1,\n      \"meta\": {\n        \"rules\": [\n          {\n            \"article\": \"By enabling Event Notifications, you receive alerts on your Amazon S3 buckets when specific events occur. For example, you can be notified of object creation, object removal, and object restoration. These notifications can alert relevant teams to accidental or intentional modifications that may lead to unauthorized data access.\",\n            \"description\": \"S3 buckets should have event notifications enabled\",\n            \"impact\": \"Not enabling S3 bucket event notifications can lead to slow or no response when specific events occur in your bucket.\",\n            \"remediation\": \"To enable and configure event notifications for an S3 bucket\\n  1. Sign in to the AWS Management Console and open the 'Amazon S3 console' at https://console.aws.amazon.com/s3/.\\n  2. In the 'Buckets list', choose the name of the bucket that you want to enable events for.\\n  3. Choose 'Properties'.\\n  4. Navigate to the 'Event Notifications' section and choose 'Create event notification'.\\n  5. In the 'General configuration' section, specify descriptive event name for your event notification. \\n    Optionally, you can also specify a prefix and a suffix to limit the notifications to objects with keys ending in the specified characters.\\n    a. Enter a description for the 'Event name'.\\n    b. (Optional) To filter event notifications by prefix, enter a 'Prefix'.\\n    c. (Optional) To filter event notifications by suffix, enter a 'Suffix'.\\n  6. In the 'Event types' section, select one or more event types that you want to receive notifications for.\\n  7. In the 'Destination' section, choose the event notification destination.\\n  Note: Before you can publish event notifications, you must grant the Amazon S3 principal the necessary permissions to call the relevant API. This is so that it can publish notifications to a Lambda function, SNS topic, or SQS queue.\\n    a. Select the destination type: Lambda Function, SNS Topic, or SQS Queue.\\n    b. After you choose your destination type, choose a function, topic, or queue from the list.\\n    c. Or, if you prefer to specify an Amazon Resource Name (ARN), select 'Enter ARN' and enter the ARN.\\n  8. Choose 'Save changes', and Amazon S3 sends a test message to the event notification destination.\",\n            \"severity\": \"Low\"\n          }\n        ]\n      },\n      \"step_passed\": false\n    }\n  ]\n}"
//            }
//        },
        {
            "action": "verify_start_job:succeeded",
            "data": {}
        },
        {
            "action": "eval:began",
            "data": {}
        },
        {
            "action": "eval:succeeded",
            "data": {
                "score": 80,
                "steps_passed_ratio": null,
                "validation": "{\n  \"result\": \"success\",\n  \"score\": 80,\n  \"steps_passed_ratio\": null,\n  \"validation_steps\": []\n}"
            }
        },
//        {
//           "action": "clean_start_job:succeeded",
//           "data": {}
//        },
//        {
//            "action": "eval:ready",
//            "data": {}
//        },
        {
            "action": "validation_credentials",
            "data": {
                "validationAccessKeyId": "AS***HQU",
                "validationManagementConsoleURL": "htt***8",
                "validationSecretAccessKey": "Vf***Ap",
                "validationSessionToken": "IQo***Y="
            }
        },

    ]
};

// 1 verification - eval:succeeded
// setupValidationString
// evalFailedValidationString
mock_events_sre_data = {
 "items": [
   {
   "action": "setup_start_job:succeeded",
   "data": {
   }
  },
    {
   "action": "setup:began",
   "data": {}
  },
//   {
//   "action": "setup:succeeded",
//   "data": {
//        "definition": {
//            "content": "{\"aws_region\": \"eu-central-1\", \"bucket_owner\": \"196241772369\", \"s3_arn\": \"arn:aws:s3:::cmtr-af96e5bd--s3--test-4062392\", \"s3_confidential_object_1\": \"customers_info_PII.csv\", \"s3_id\": \"cmtr-af96e5bd--s3--test-4062392\", \"sns_topic_arn\": \"arn:aws:sns:eu-central-1:196241772369:cmtr-af96e5bd--sns--test\", \"sns_topic_name\": \"cmtr-af96e5bd--sns--test\"}"
//        },
//        "validation": "{\n  \"result\": null,\n  \"validation_steps\": [\n    {\n      \"description\": \"Verify if the resource with ID 'cmtr-af96e5bd--s3--test-4062392' in the service 'S3' in the region 'global' violates rules\",\n      \"index\": 1,\n      \"meta\": {\n        \"rules\": [\n          {\n            \"article\": \"By enabling Event Notifications, you receive alerts on your Amazon S3 buckets when specific events occur. For example, you can be notified of object creation, object removal, and object restoration. These notifications can alert relevant teams to accidental or intentional modifications that may lead to unauthorized data access.\",\n            \"description\": \"S3 buckets should have event notifications enabled\",\n            \"impact\": \"Not enabling S3 bucket event notifications can lead to slow or no response when specific events occur in your bucket.\",\n            \"remediation\": \"To enable and configure event notifications for an S3 bucket\\n  1. Sign in to the AWS Management Console and open the 'Amazon S3 console' at https://console.aws.amazon.com/s3/.\\n  2. In the 'Buckets list', choose the name of the bucket that you want to enable events for.\\n  3. Choose 'Properties'.\\n  4. Navigate to the 'Event Notifications' section and choose 'Create event notification'.\\n  5. In the 'General configuration' section, specify descriptive event name for your event notification. \\n    Optionally, you can also specify a prefix and a suffix to limit the notifications to objects with keys ending in the specified characters.\\n    a. Enter a description for the 'Event name'.\\n    b. (Optional) To filter event notifications by prefix, enter a 'Prefix'.\\n    c. (Optional) To filter event notifications by suffix, enter a 'Suffix'.\\n  6. In the 'Event types' section, select one or more event types that you want to receive notifications for.\\n  7. In the 'Destination' section, choose the event notification destination.\\n  Note: Before you can publish event notifications, you must grant the Amazon S3 principal the necessary permissions to call the relevant API. This is so that it can publish notifications to a Lambda function, SNS topic, or SQS queue.\\n    a. Select the destination type: Lambda Function, SNS Topic, or SQS Queue.\\n    b. After you choose your destination type, choose a function, topic, or queue from the list.\\n    c. Or, if you prefer to specify an Amazon Resource Name (ARN), select 'Enter ARN' and enter the ARN.\\n  8. Choose 'Save changes', and Amazon S3 sends a test message to the event notification destination.\",\n            \"severity\": \"Low\"\n          },\n          {\n            \"article\": \"At the Amazon S3 bucket level, you can configure permissions through a bucket policy making the objects accessible only through HTTPS.\",\n            \"description\": \"S3 Bucket Policy allows HTTP requests\",\n            \"impact\": \"The HTTP protocol is not a secure method of transmitting data. Any person monitoring the Internet traffic can see unencrypted data, which leads to a breach of confidentiality.\",\n            \"remediation\": \"1. Login to the AWS Management Console and open the Amazon S3 console using  https://console.aws.amazon.com/s3/ .\\n2. Select the Check box next to Bucket. \\n3. Click on 'Permissions'. \\n4. Click on 'Bucket Policy'.\\n5. Filling in the required information, add the following to the existing policy: \\n{\\n  \\\"Sid\\\": \\\"<optional>\\\",  \\n  \\\"Effect\\\": \\\"Deny\\\",  \\n  \\\"Principal\\\": \\\"*\\\",  \\n  \\\"Action\\\": \\\"s3:GetObject\\\",  \\n  \\\"Resource\\\": \\\"arn:aws:s3:::<bucket_name>/*\\\",  \\n  \\\"Condition\\\": {\\n    \\\"Bool\\\": {\\n      \\\"aws:SecureTransport\\\": \\\"false\\\"  \\n    }  \\n  }  \\n} \\n6. Save. \\n7. Repeat for all the buckets in your AWS account that contain sensitive data.\",\n            \"severity\": \"High\"\n          },\n          {\n            \"article\": \"An S3 Lifecycle configuration is a set of rules that define actions that Amazon S3 applies to a group of objects.\\nIt is recommended to configure lifecycle rules on your Amazon S3 bucket as these rules help you define actions that you want Amazon S3 to take during an object's lifetime. Configure their Amazon S3 Lifecycle, to manage your objects so that they are stored cost effectively throughout their lifecycle.\",\n            \"description\": \"S3 buckets with versioning enabled do not have lifecycle policies configured\",\n            \"impact\": \"Without the S3 lifecycle configuration when versioning enabled, you are missing out on the opportunity to manage S3 objects so that they are stored cost-effectively throughout their lifecycle by moving data to more economical storage classes over time or expiring data based on the object age.\",\n            \"remediation\": \"To create a lifecycle rule:\\n  1. Sign in to the AWS Management Console and open the Amazon S3 console at https://console.aws.amazon.com/s3/.\\n  2. In the 'Buckets' list, choose the name of the bucket that you want to create a lifecycle rule for.\\n  3. Choose the 'Management' tab, and choose 'Create lifecycle rule'.\\n  4. In 'Lifecycle rule name', enter a name for your rule. The name must be unique within the bucket.\\n  5. Choose the scope of the lifecycle rule:\\n    - To apply this lifecycle rule to all objects with a specific prefix or tag, choose 'Limit the scope to specific prefixes or tags'.\\n      - To limit the scope by prefix, in 'Prefix', enter the prefix.\\n      - To limit the scope by tag, choose 'Add tag', and enter the tag key and value.\\n    - To apply this lifecycle rule to all objects in the bucket, choose 'This rule applies to all objects in the bucket', and choose 'I acknowledge that this rule applies to all objects in the bucket'.\\n  6. To filter a rule by object size, you can check 'Specify minimum object size, Specify maximum object size', or both options.\\n    - When you're specifying a 'minimum object' size or 'maximum object size', the value must be larger than 0 bytes and up to 5TB. You can specify this value in bytes, KB, MB, or GB.\\n    - When you're specifying both, the maximum object size must be larger than the minimum object size.\\n  7. Under Lifecycle rule actions, choose the actions that you want your lifecycle rule to perform:\\n    - Transition current versions of objects between storage classes\\n    - Transition previous versions of objects between storage classes\\n    - Expire current versions of objects\\n    - Permanently delete previous versions of objects\\n    - Delete expired delete markers or incomplete multipart uploads\\n    Depending on the actions that you choose, different options appear.\\n  8. To transition current versions of objects between storage classes, under 'Transition current versions of objects between storage classes':\\n    a. In 'Storage class transitions', choose the storage class to transition to:\\n      - Standard-IA\\n      - Intelligent-Tiering\\n      - One Zone-IA\\n      - S3 Glacier Flexible Retrieval\\n      - Glacier Deep Archive\\n    b. In 'Days after object creation', enter the number of days after creation to transition the object.\\n    ! Important:\\n      When you choose the S3 Glacier Flexible Retrieval or Glacier Deep Archive storage class, your objects remain in Amazon S3. You cannot access them directly through the separate Amazon S3 Glacier service.\\n  9. To transition non-current versions of objects between storage classes, under 'Transition non-current versions of objects between storage classes':\\n    a. In 'Storage class transitions', choose the storage class to transition to:\\n      - Standard-IA\\n      - Intelligent-Tiering\\n      - One Zone-IA\\n      - S3 Glacier Flexible Retrieval\\n      - Glacier Deep Archive\\n    b. In Days after object becomes non-current, enter the number of days after creation to transition the object.\\n  10. To expire current versions of objects, under 'Expire previous versions of objects', in 'Number of days after object creation', enter the number of days.\\n  ! Important:\\n    In a non-versioned bucket the expiration action results in Amazon S3 permanently removing the object.\\n  11. To permanently delete previous versions of objects, under 'Permanently delete noncurrent versions of objects', in 'Days after objects become noncurrent', enter the number of days. You can optionally specify the number of newer versions to retain by entering a value under 'Number of newer versions to retain'.\\n  12. Under 'Delete expired delete markers or incomplete multipart uploads', choose' Delete expired object delete markers' and 'Delete incomplete multipart uploads'. Then, enter the number of days after the multipart upload initiation that you want to end and clean up incomplete multipart uploads.\\n  13. Choose 'Create rule'.\\n      If the rule does not contain any errors, Amazon S3 enables it, and you can see it on the 'Management' tab under 'Lifecycle rules'.\",\n            \"severity\": \"Info\"\n          }\n        ]\n      }\n    }\n  ]\n}"
//    }
//  },
   {
   "action": "setup:succeeded",
   "data": {
        "definition": {
            "content": "{\"aws_region\": \"eu-central-1\", \"bucket_owner\": \"196241772369\", \"s3_arn\": \"arn:aws:s3:::cmtr-af96e5bd--s3--test-4062392\", \"s3_confidential_object_1\": \"customers_info_PII.csv\", \"s3_id\": \"cmtr-af96e5bd--s3--test-4062392\", \"sns_topic_arn\": \"arn:aws:sns:eu-central-1:196241772369:cmtr-af96e5bd--sns--test\", \"sns_topic_name\": \"cmtr-af96e5bd--sns--test\"}"
        },
        "validation": setupValidationString
    }
  },
  {
   "action": "eval:ready",
   "data": {}
  },
    {
   "action": "verify_start_job:succeeded",
   "data": {}
  },
  {
   "action": "eval:began",
   "data": {}
  },
//  {
//    "action": "eval:failed",
//    "data": {
//        "score": 0,
//        "steps_passed_ratio": null,
//        "validation": "{\n  \"result\": \"failed\",\n  \"score\": 0,\n  \"steps_passed_ratio\": null,\n  \"validation_steps\": [\n    {\n      \"description\": \"Verify if the resource with ID 'cmtr-af96e5bd--s3--test-4062392' in the service 'S3' in the region 'global' violates rules\",\n      \"index\": 1,\n      \"meta\": {\n        \"rules\": [\n          {\n            \"article\": \"By enabling Event Notifications, you receive alerts on your Amazon S3 buckets when specific events occur. For example, you can be notified of object creation, object removal, and object restoration. These notifications can alert relevant teams to accidental or intentional modifications that may lead to unauthorized data access.\",\n            \"description\": \"S3 buckets should have event notifications enabled\",\n            \"impact\": \"Not enabling S3 bucket event notifications can lead to slow or no response when specific events occur in your bucket.\",\n            \"remediation\": \"To enable and configure event notifications for an S3 bucket\\n  1. Sign in to the AWS Management Console and open the 'Amazon S3 console' at https://console.aws.amazon.com/s3/.\\n  2. In the 'Buckets list', choose the name of the bucket that you want to enable events for.\\n  3. Choose 'Properties'.\\n  4. Navigate to the 'Event Notifications' section and choose 'Create event notification'.\\n  5. In the 'General configuration' section, specify descriptive event name for your event notification. \\n    Optionally, you can also specify a prefix and a suffix to limit the notifications to objects with keys ending in the specified characters.\\n    a. Enter a description for the 'Event name'.\\n    b. (Optional) To filter event notifications by prefix, enter a 'Prefix'.\\n    c. (Optional) To filter event notifications by suffix, enter a 'Suffix'.\\n  6. In the 'Event types' section, select one or more event types that you want to receive notifications for.\\n  7. In the 'Destination' section, choose the event notification destination.\\n  Note: Before you can publish event notifications, you must grant the Amazon S3 principal the necessary permissions to call the relevant API. This is so that it can publish notifications to a Lambda function, SNS topic, or SQS queue.\\n    a. Select the destination type: Lambda Function, SNS Topic, or SQS Queue.\\n    b. After you choose your destination type, choose a function, topic, or queue from the list.\\n    c. Or, if you prefer to specify an Amazon Resource Name (ARN), select 'Enter ARN' and enter the ARN.\\n  8. Choose 'Save changes', and Amazon S3 sends a test message to the event notification destination.\",\n            \"severity\": \"Low\"\n          },\n          {\n            \"article\": \"An S3 Lifecycle configuration is a set of rules that define actions that Amazon S3 applies to a group of objects.\\nIt is recommended to configure lifecycle rules on your Amazon S3 bucket as these rules help you define actions that you want Amazon S3 to take during an object's lifetime. Configure their Amazon S3 Lifecycle, to manage your objects so that they are stored cost effectively throughout their lifecycle.\",\n            \"description\": \"S3 buckets with versioning enabled do not have lifecycle policies configured\",\n            \"impact\": \"Without the S3 lifecycle configuration when versioning enabled, you are missing out on the opportunity to manage S3 objects so that they are stored cost-effectively throughout their lifecycle by moving data to more economical storage classes over time or expiring data based on the object age.\",\n            \"remediation\": \"To create a lifecycle rule:\\n  1. Sign in to the AWS Management Console and open the Amazon S3 console at https://console.aws.amazon.com/s3/.\\n  2. In the 'Buckets' list, choose the name of the bucket that you want to create a lifecycle rule for.\\n  3. Choose the 'Management' tab, and choose 'Create lifecycle rule'.\\n  4. In 'Lifecycle rule name', enter a name for your rule. The name must be unique within the bucket.\\n  5. Choose the scope of the lifecycle rule:\\n    - To apply this lifecycle rule to all objects with a specific prefix or tag, choose 'Limit the scope to specific prefixes or tags'.\\n      - To limit the scope by prefix, in 'Prefix', enter the prefix.\\n      - To limit the scope by tag, choose 'Add tag', and enter the tag key and value.\\n    - To apply this lifecycle rule to all objects in the bucket, choose 'This rule applies to all objects in the bucket', and choose 'I acknowledge that this rule applies to all objects in the bucket'.\\n  6. To filter a rule by object size, you can check 'Specify minimum object size, Specify maximum object size', or both options.\\n    - When you're specifying a 'minimum object' size or 'maximum object size', the value must be larger than 0 bytes and up to 5TB. You can specify this value in bytes, KB, MB, or GB.\\n    - When you're specifying both, the maximum object size must be larger than the minimum object size.\\n  7. Under Lifecycle rule actions, choose the actions that you want your lifecycle rule to perform:\\n    - Transition current versions of objects between storage classes\\n    - Transition previous versions of objects between storage classes\\n    - Expire current versions of objects\\n    - Permanently delete previous versions of objects\\n    - Delete expired delete markers or incomplete multipart uploads\\n    Depending on the actions that you choose, different options appear.\\n  8. To transition current versions of objects between storage classes, under 'Transition current versions of objects between storage classes':\\n    a. In 'Storage class transitions', choose the storage class to transition to:\\n      - Standard-IA\\n      - Intelligent-Tiering\\n      - One Zone-IA\\n      - S3 Glacier Flexible Retrieval\\n      - Glacier Deep Archive\\n    b. In 'Days after object creation', enter the number of days after creation to transition the object.\\n    ! Important:\\n      When you choose the S3 Glacier Flexible Retrieval or Glacier Deep Archive storage class, your objects remain in Amazon S3. You cannot access them directly through the separate Amazon S3 Glacier service.\\n  9. To transition non-current versions of objects between storage classes, under 'Transition non-current versions of objects between storage classes':\\n    a. In 'Storage class transitions', choose the storage class to transition to:\\n      - Standard-IA\\n      - Intelligent-Tiering\\n      - One Zone-IA\\n      - S3 Glacier Flexible Retrieval\\n      - Glacier Deep Archive\\n    b. In Days after object becomes non-current, enter the number of days after creation to transition the object.\\n  10. To expire current versions of objects, under 'Expire previous versions of objects', in 'Number of days after object creation', enter the number of days.\\n  ! Important:\\n    In a non-versioned bucket the expiration action results in Amazon S3 permanently removing the object.\\n  11. To permanently delete previous versions of objects, under 'Permanently delete noncurrent versions of objects', in 'Days after objects become noncurrent', enter the number of days. You can optionally specify the number of newer versions to retain by entering a value under 'Number of newer versions to retain'.\\n  12. Under 'Delete expired delete markers or incomplete multipart uploads', choose' Delete expired object delete markers' and 'Delete incomplete multipart uploads'. Then, enter the number of days after the multipart upload initiation that you want to end and clean up incomplete multipart uploads.\\n  13. Choose 'Create rule'.\\n      If the rule does not contain any errors, Amazon S3 enables it, and you can see it on the 'Management' tab under 'Lifecycle rules'.\",\n            \"severity\": \"Info\"\n          },\n          {\n            \"article\": \"At the Amazon S3 bucket level, you can configure permissions through a bucket policy making the objects accessible only through HTTPS.\",\n            \"description\": \"S3 Bucket Policy allows HTTP requests\",\n            \"impact\": \"The HTTP protocol is not a secure method of transmitting data. Any person monitoring the Internet traffic can see unencrypted data, which leads to a breach of confidentiality.\",\n            \"remediation\": \"1. Login to the AWS Management Console and open the Amazon S3 console using  https://console.aws.amazon.com/s3/ .\\n2. Select the Check box next to Bucket. \\n3. Click on 'Permissions'. \\n4. Click on 'Bucket Policy'.\\n5. Filling in the required information, add the following to the existing policy: \\n{\\n  \\\"Sid\\\": \\\"<optional>\\\",  \\n  \\\"Effect\\\": \\\"Deny\\\",  \\n  \\\"Principal\\\": \\\"*\\\",  \\n  \\\"Action\\\": \\\"s3:GetObject\\\",  \\n  \\\"Resource\\\": \\\"arn:aws:s3:::<bucket_name>/*\\\",  \\n  \\\"Condition\\\": {\\n    \\\"Bool\\\": {\\n      \\\"aws:SecureTransport\\\": \\\"false\\\"  \\n    }  \\n  }  \\n} \\n6. Save. \\n7. Repeat for all the buckets in your AWS account that contain sensitive data.\",\n            \"severity\": \"High\"\n          }\n        ]\n      },\n      \"step_passed\": false\n    }\n  ]\n}"
//    }
//  },
    {
    "action": "eval:failed",
    "data": {
        "score": 0,
        "steps_passed_ratio": null,
        "validation": evalFailedNewViolationAddedString
        }
    },
    {
    "action": "eval:failed",
    "data": {
        "score": 0,
        "steps_passed_ratio": null,
        "validation": evalFailedNewViolationAddedString2
        }
    },

//  {
//   "action": "eval:succeeded",
//   "data": {
//    "score": 50,
//    "terraform": {
//     "output_log_at": "s3://cmtr-syndicate-education-platform-verification-output-dev/Maksym_Andriienko/CMDP/sre/sre02/verification_output_017.txt"
//    }
//   }
//  },
//  {
//   "action": "clean_start_job:succeeded",
//   "data": {
//    "job_id": "1fac9ef4-5678-4efe-9adb-3f980c1c8a76",
//    "job_name": "CMDP-sre-sre02-af96e5bd-2024-06-20_13_31_30"
//   }
//  },
//  {
//   "action": "cleanup:began",
//   "data": {}
//  },
//  {
//   "action": "cleanup:succeeded",
//   "data": {
//    "log": "",
//    "passed": "success",
//    "score": 50,
//    "status": null,
//    "unblock_feedback": null
//   }
//  },
 ],
};

// no verifications, abort
mock_events_sre_data1 = {
 "items": [
  {
   "action": "setup_start_job:succeeded",
   "data": {}
  },
  {
   "action": "setup:began",
   "data": {}
  },
  {
    "action": "setup:succeeded",
    "data": {
        "definition": {
            "content": "{\"aws_region\": \"eu-central-1\", \"backup_plan_name\": \"cmtr-af96e5bd-backup-plan-test\", \"backup_rule_name\": \"cmtr-af96e5bd-backup-rule-test\", \"ebs_id_1\": \"vol-09105e5f9bdaf2d9d\", \"ebs_id_2\": \"vol-048df1bca96e08fe9\", \"ec2_instance_id\": \"i-03f394f8fe9053cc9\", \"efs_id_1\": \"fs-098e9e7d48f45d251\", \"efs_id_2\": \"fs-04257eaa9d840cfd4\", \"efs_name_1\": \"cmtr-af96e5bd-efs-1-test\"}"
        },
        "validation": "{\n  \"result\": null,\n  \"validation_steps\": [\n    {\n      \"description\": \"Verify if the resource with ID 'fs-098e9e7d48f45d251' in the service 'EFS' in the region 'eu-central-1' violates rules\",\n      \"index\": 1,\n      \"meta\": {\n        \"rules\": [\n          {\n            \"article\": \"Enable encryption of your EFS file systems in order to protect your data and metadata from breaches or unauthorized access and fulfill compliance requirements for data-at-rest encryption within your organization.\",\n            \"description\": \"Amazon EFS file systems are not encrypted\",\n            \"impact\": \"Disabled encryption allows a user to get unauthorized access to sensitive data in EFS.\",\n            \"remediation\": \"Note: Affected resource must be redeployed to mitigate the issue.\\nIn order to encrypt the existing Amazon EFS with your own AWS KMS CMK, you need to create a new Amazon EFS and transfer all the data from the existing EFS to the new one with encryption enabled.\\n1. Login to the AWS Management Console and Navigate to Elastic File System (EFS) dashboard.\\n2. Select File Systems from the left navigation panel.\\n3. Click 'Create File System' button from the dashboard top menu to start the file system setup process.\\n4. On the 'Configure file system access' configuration page, perform the following actions.\\n  4.1 Choose the right VPC from the VPC dropdown list.\\n  4.2 Within 'Create mount targets' section, select the checkboxes for all of the Availability Zones (AZs) within the selected VPC. These will be your mount targets.\\n  4.3 Click 'Next step' to continue.\\n5. Perform the following on the 'Configure optional settings' page.\\n  5.1 Create tags to describe your new file system.\\n  5.2 Choose performance mode based on your requirements.\\n  5.3 Check 'Enable encryption' checkbox and choose aws/elasticfilesystem from Select KMS master key dropdown list to enable encryption for the new file system using the default master key provided and managed by AWS KMS.\\n  5.4 Click 'Next step' to continue.\\n6. Review the file system configuration details on the review and create page and then click 'Create File System' to create your new AWS EFS file system.\\n7. Copy the data from the old unencrypted EFS file system onto the newly create encrypted file system.\\n8. Remove the unencrypted file system as soon as your data migration to the newly create encrypted file system is completed.\",\n            \"severity\": \"High\"\n          },\n          {\n            \"article\": \"Amazon EFS lifecycle management automatically manages cost-effective file storage for your file systems.\\nAmazon EFS supports two lifecycle policies. 'Transition into IA' instructs lifecycle management when to transition files into the file system's Infrequent Access storage class. 'Transition out of IA' instructs EFS Intelligent-Tiering when to transition files out of IA storage. Lifecycle policies apply to the entire Amazon EFS file system.\",\n            \"description\": \"Amazon EFS filesystem without lifecycle management\",\n            \"impact\": \"Without the EFS lifecycle configuration, you are missing out on the opportunity to manage files so that they are stored cost-effectively throughout their lifecycle by moving data to more economical storage classes over time.\",\n            \"remediation\": \"You can use the AWS Management Console to set the lifecycle policies for an existing file system:\\n  1. Sign in to the AWS Management Console and open the Amazon EFS console at https://console.aws.amazon.com/efs/.\\n  2. Choose 'File systems' to display the list of file systems in your account.\\n  3. Choose the file system on which you want to modify lifecycle policies.\\n  4. On the file system details page, in the 'General' section, choose 'Edit'. The 'Edit' page displays.\\n  5. For Lifecycle management, you can change the following lifecycle policies:\\n    - Set 'Transition into IA' to one of the available settings.\\n    - Set 'Transition out of IA' to 'On first access' to move files that are in IA storage to standard storage when they're accessed for non-metadata operations.\\n  6. Choose 'Save changes' to save your changes.\",\n            \"severity\": \"Medium\"\n          }\n        ]\n      }\n    },\n    {\n      \"description\": \"Verify if the resource with ID 'fs-04257eaa9d840cfd4' in the service 'EFS' in the region 'eu-central-1' violates rules\",\n      \"index\": 2,\n      \"meta\": {\n        \"rules\": [\n          {\n            \"article\": \"Removing EFS without mount target will help you to avoid unexpected charges on your AWS bill and make cloud more organized.\",\n            \"description\": \"Unused Amazon EFS file systems\",\n            \"impact\": \"Having an EFS without any mount targets can lead to wasted costs, unused resources, cluttered cloud environment.\",\n            \"remediation\": \"1. Login to the AWS Management Console and Navigate to Elastic File System (EFS) dashboard.\\n2. Select File Systems from the left navigation panel.\\n3. Click on the required file system.\\n4. Click 'Attach' and then click on the 'Manage mount targets'.\\n5. Choose 'VPC' and click on the 'Add mount target'.\\n6. Choose 'Availability zone', 'Subnet ID', 'IP address', 'Security Groups'.\\n7. Save.\",\n            \"severity\": \"Medium\"\n          },\n          {\n            \"article\": \"Amazon EFS lifecycle management automatically manages cost-effective file storage for your file systems.\\nAmazon EFS supports two lifecycle policies. 'Transition into IA' instructs lifecycle management when to transition files into the file system's Infrequent Access storage class. 'Transition out of IA' instructs EFS Intelligent-Tiering when to transition files out of IA storage. Lifecycle policies apply to the entire Amazon EFS file system.\",\n            \"description\": \"Amazon EFS filesystem without lifecycle management\",\n            \"impact\": \"Without the EFS lifecycle configuration, you are missing out on the opportunity to manage files so that they are stored cost-effectively throughout their lifecycle by moving data to more economical storage classes over time.\",\n            \"remediation\": \"You can use the AWS Management Console to set the lifecycle policies for an existing file system:\\n  1. Sign in to the AWS Management Console and open the Amazon EFS console at https://console.aws.amazon.com/efs/.\\n  2. Choose 'File systems' to display the list of file systems in your account.\\n  3. Choose the file system on which you want to modify lifecycle policies.\\n  4. On the file system details page, in the 'General' section, choose 'Edit'. The 'Edit' page displays.\\n  5. For Lifecycle management, you can change the following lifecycle policies:\\n    - Set 'Transition into IA' to one of the available settings.\\n    - Set 'Transition out of IA' to 'On first access' to move files that are in IA storage to standard storage when they're accessed for non-metadata operations.\\n  6. Choose 'Save changes' to save your changes.\",\n            \"severity\": \"Medium\"\n          }\n        ]\n      }\n    },\n    {\n      \"description\": \"Verify if the resource with ID 'vol-048df1bca96e08fe9' in the service 'EC2' in the region 'eu-central-1' violates rules\",\n      \"index\": 3,\n      \"meta\": {\n        \"rules\": [\n          {\n            \"article\": \"By selecting gp3 volumes over gp2 ones, you can elevate your application's performance, lessen storage expenditures, and fine-tune your infrastructure for heightened efficiency.\",\n            \"description\": \"EBS volumes are type of gp2 instead of gp3\",\n            \"impact\": \"Not using gp3 over gp2 will lead to higher costs and worse performance.\",\n            \"remediation\": \"Note: Affected resource must be redeployed to mitigate the issue.\\n\\nTo create gp3 volume and migrate data:\\n1. Login to the AWS Management Console and open the Amazon EC2 console using https://console.aws.amazon.com/ec2/.\\n2. Under Elastic Block Store, click on 'Volumes'.\\n3. Click on required volume.\\n4. Click on the 'Actions'.\\n5. Click on the 'Create snapshot'.\\n6. Create snapshot.\\n7. Under Elastic Block Store, click on 'Snapshots'.\\n8. Click on the required snapshot.\\n9. Click on the 'Actions', and 'Create volume from snapshot'.\\n10. Under the 'volume type' choose 'gp3'.\\n11. Click on the Create volume.\",\n            \"severity\": \"Low\"\n          }\n        ]\n      }\n    },\n    {\n      \"description\": \"Verify if the resource with ID 'vol-09105e5f9bdaf2d9d' in the service 'EC2' in the region 'eu-central-1' violates rules\",\n      \"index\": 4,\n      \"meta\": {\n        \"rules\": [\n          {\n            \"article\": \"Removing unattached/orphaned Elastic Block Store volumes will help you avoid unexpected charges on your AWS bill and halt access to any sensitive data available on these volumes.\",\n            \"description\": \"Unused EBS volumes exist\",\n            \"impact\": \"Not removing unattached/orphaned Elastic Block Store volumes still get charges on your AWS bill.\",\n            \"remediation\": \"To create snapshot before deleting the volume (optional):\\n1. Login to the AWS Management Console and open the Amazon EC2 console using https://console.aws.amazon.com/ec2/ \\n2. Under Elastic Block Store, click on Volumes. \\n3. Click on the required volume.\\n4. Under the Actions, click on Create snapshot.\\n5. Click on the Create snapshot.\\n\\nTo delete EBS Volume \\n1. Login to the AWS Management Console and open the Amazon EC2 console using https://console.aws.amazon.com/ec2/ \\n2. Under Elastic Block Store, click on Volumes. \\n3. Click on the required volume.\\n4. Under the Actions, click on Delete volume.\",\n            \"severity\": \"Medium\"\n          }\n        ]\n      }\n    }\n  ]\n}"
    }
  },
  {
   "action": "eval:ready",
   "data": {}
  },
    {
        "action": "verify_start_job:succeeded",
        "data": {}
    },
    {
        "action": "eval:failed",
        "data": {
            "score": 0,
            "steps_passed_ratio": null,
            "validation": "{\n  \"result\": \"failed\",\n  \"score\": 0,\n  \"steps_passed_ratio\": null,\n  \"validation_steps\": [\n    {\n      \"description\": \"Verify if the resource with ID 'fs-098e9e7d48f45d251' in the service 'EFS' in the region 'eu-central-1' violates rules\",\n      \"index\": 1,\n      \"meta\": {\n        \"rules\": [\n          {\n            \"article\": \"Enable encryption of your EFS file systems in order to protect your data and metadata from breaches or unauthorized access and fulfill compliance requirements for data-at-rest encryption within your organization.\",\n            \"description\": \"Amazon EFS file systems are not encrypted\",\n            \"impact\": \"Disabled encryption allows a user to get unauthorized access to sensitive data in EFS.\",\n            \"remediation\": \"Note: Affected resource must be redeployed to mitigate the issue.\\nIn order to encrypt the existing Amazon EFS with your own AWS KMS CMK, you need to create a new Amazon EFS and transfer all the data from the existing EFS to the new one with encryption enabled.\\n1. Login to the AWS Management Console and Navigate to Elastic File System (EFS) dashboard.\\n2. Select File Systems from the left navigation panel.\\n3. Click 'Create File System' button from the dashboard top menu to start the file system setup process.\\n4. On the 'Configure file system access' configuration page, perform the following actions.\\n  4.1 Choose the right VPC from the VPC dropdown list.\\n  4.2 Within 'Create mount targets' section, select the checkboxes for all of the Availability Zones (AZs) within the selected VPC. These will be your mount targets.\\n  4.3 Click 'Next step' to continue.\\n5. Perform the following on the 'Configure optional settings' page.\\n  5.1 Create tags to describe your new file system.\\n  5.2 Choose performance mode based on your requirements.\\n  5.3 Check 'Enable encryption' checkbox and choose aws/elasticfilesystem from Select KMS master key dropdown list to enable encryption for the new file system using the default master key provided and managed by AWS KMS.\\n  5.4 Click 'Next step' to continue.\\n6. Review the file system configuration details on the review and create page and then click 'Create File System' to create your new AWS EFS file system.\\n7. Copy the data from the old unencrypted EFS file system onto the newly create encrypted file system.\\n8. Remove the unencrypted file system as soon as your data migration to the newly create encrypted file system is completed.\",\n            \"severity\": \"High\"\n          },\n          {\n            \"article\": \"Amazon EFS lifecycle management automatically manages cost-effective file storage for your file systems.\\nAmazon EFS supports two lifecycle policies. 'Transition into IA' instructs lifecycle management when to transition files into the file system's Infrequent Access storage class. 'Transition out of IA' instructs EFS Intelligent-Tiering when to transition files out of IA storage. Lifecycle policies apply to the entire Amazon EFS file system.\",\n            \"description\": \"Amazon EFS filesystem without lifecycle management\",\n            \"impact\": \"Without the EFS lifecycle configuration, you are missing out on the opportunity to manage files so that they are stored cost-effectively throughout their lifecycle by moving data to more economical storage classes over time.\",\n            \"remediation\": \"You can use the AWS Management Console to set the lifecycle policies for an existing file system:\\n  1. Sign in to the AWS Management Console and open the Amazon EFS console at https://console.aws.amazon.com/efs/.\\n  2. Choose 'File systems' to display the list of file systems in your account.\\n  3. Choose the file system on which you want to modify lifecycle policies.\\n  4. On the file system details page, in the 'General' section, choose 'Edit'. The 'Edit' page displays.\\n  5. For Lifecycle management, you can change the following lifecycle policies:\\n    - Set 'Transition into IA' to one of the available settings.\\n    - Set 'Transition out of IA' to 'On first access' to move files that are in IA storage to standard storage when they're accessed for non-metadata operations.\\n  6. Choose 'Save changes' to save your changes.\",\n            \"severity\": \"Medium\"\n          },\n          {\n            \"article\": \"Removing EFS without mount target will help you to avoid unexpected charges on your AWS bill and make cloud more organized.\",\n            \"description\": \"Unused Amazon EFS file systems\",\n            \"impact\": \"Having an EFS without any mount targets can lead to wasted costs, unused resources, cluttered cloud environment.\",\n            \"remediation\": \"1. Login to the AWS Management Console and Navigate to Elastic File System (EFS) dashboard.\\n2. Select File Systems from the left navigation panel.\\n3. Click on the required file system.\\n4. Click 'Attach' and then click on the 'Manage mount targets'.\\n5. Choose 'VPC' and click on the 'Add mount target'.\\n6. Choose 'Availability zone', 'Subnet ID', 'IP address', 'Security Groups'.\\n7. Save.\",\n            \"severity\": \"Medium\"\n          }\n        ]\n      },\n      \"step_passed\": false\n    },\n    {\n      \"description\": \"Verify if the resource with ID 'fs-04257eaa9d840cfd4' in the service 'EFS' in the region 'eu-central-1' violates rules\",\n      \"index\": 2,\n      \"meta\": {\n        \"rules\": [\n          {\n            \"article\": \"Amazon EFS lifecycle management automatically manages cost-effective file storage for your file systems.\\nAmazon EFS supports two lifecycle policies. 'Transition into IA' instructs lifecycle management when to transition files into the file system's Infrequent Access storage class. 'Transition out of IA' instructs EFS Intelligent-Tiering when to transition files out of IA storage. Lifecycle policies apply to the entire Amazon EFS file system.\",\n            \"description\": \"Amazon EFS filesystem without lifecycle management\",\n            \"impact\": \"Without the EFS lifecycle configuration, you are missing out on the opportunity to manage files so that they are stored cost-effectively throughout their lifecycle by moving data to more economical storage classes over time.\",\n            \"remediation\": \"You can use the AWS Management Console to set the lifecycle policies for an existing file system:\\n  1. Sign in to the AWS Management Console and open the Amazon EFS console at https://console.aws.amazon.com/efs/.\\n  2. Choose 'File systems' to display the list of file systems in your account.\\n  3. Choose the file system on which you want to modify lifecycle policies.\\n  4. On the file system details page, in the 'General' section, choose 'Edit'. The 'Edit' page displays.\\n  5. For Lifecycle management, you can change the following lifecycle policies:\\n    - Set 'Transition into IA' to one of the available settings.\\n    - Set 'Transition out of IA' to 'On first access' to move files that are in IA storage to standard storage when they're accessed for non-metadata operations.\\n  6. Choose 'Save changes' to save your changes.\",\n            \"severity\": \"Medium\"\n          }\n        ]\n      },\n      \"step_passed\": false\n    }\n  ]\n}"
        }
    }
 ]
};