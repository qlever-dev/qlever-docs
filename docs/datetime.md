# Date and Time Support in QLever

This page describes which features from the [SEP-0002](https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0002/sep-0002.md) are supported in QLever, and how to use them.

## Datatypes
QLever supports the following `xsd` Date/Time datatypes:

| Type | Example | Description |
|--|--|--|
|`xsd:time`|`"09:30:10Z"^^xsd:time`|A time containing hour, minute, and second.|
|`xsd:date`|`"2025-12-24"^^xsd:date`|Simple date containing year, month and day. |
|`xsd:dateTime`|`"2025-12-24T18:11:00Z"^^xsd:dateTime`|Date combined with time (hour, minute, second, and optional timezone).|
|`xsd:duration`|`"P1Y2M1D"^^xsd:duration`|A time interval that may contain years, months, days and time components (hours, minutes, seconds).|
|`xsd:dayTimeDuration`|`"P2DT4H5M6S"^^xsd:dayTimeDuration`|A time interval consisting of days and time components (hours, minutes, seconds).|
|`xsd:yearMonthDuration`|`"P12Y2M"^^xsd:yearMonthDuration`|A time interval consisting of years and months.| 
|`xsd:gYear`|`"12000"^^xsd:gYear`|A (potentially large) year. Negative years are also allowed.|

TODO: time und yearMonthDuration supported?

TODO: dateTime = < > ist auch supported aber nicht im SEP (auch hier Probleme mit TimeZone).

## Arithmetics

### Equality  = 

`xsd:duration = xsd:duration`<a id="durationEQduration"></a>:
??? note "Example query for `xsd:duration = xsd:duration`"

    The first two durations are equal. The third duration has an additional year.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?duration1 ?duration2 ?duration3 ?eq ?neq
    WHERE {
        BIND("P1Y2M1D"^^xsd:duration AS ?duration1)
	    BIND("P1Y2M1D"^^xsd:duration AS ?duration2)
	    BIND("P2Y2M1D"^^xsd:duration AS ?duration3)
		BIND(?duration1 = ?duration2 AS ?eq)
		BIND(?duration1 = ?duration3 AS ?neq)
    }
    ```

`xsd:date = xsd:date`<a id="dateEQdate"></a>:
??? note "Example query for `xsd:date = xsd:date`"

    The first two dates are equal. The third date is from another year.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date1 ?date2 ?date3 ?eq ?neq
    WHERE {
        BIND("2025-12-24"^^xsd:date AS ?date1)
	    BIND("2025-12-24"^^xsd:date AS ?date2)
	    BIND("1925-12-24"^^xsd:date AS ?date3)
		BIND(?date1 = ?date2 AS ?eq)
		BIND(?date1 = ?date3 AS ?neq)
    }
    ```

`xsd:time = xsd:time`<a id="timeEQtime"></a>:
This operation does not handle different timezones correctly yet. For example `09:30:10Z` (UTC) and `08:30:10-01:00` (UTC - 1) will not be seen as equal.
??? note "Example query for `xsd:time = xsd:time`"

    The first two times are equal. The third time is two hours earlier.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?time1 ?time2 ?time3 ?eq ?neq
    WHERE {
        BIND("09:30:10Z"^^xsd:time AS ?time1)
	    BIND("09:30:10Z"^^xsd:time AS ?time2)
	    BIND("07:30:10Z"^^xsd:time AS ?time3)
		BIND(?time1 = ?time2 AS ?eq)
		BIND(?time1 = ?time3 AS ?neq)
    }
    ```

`xsd:dateTime = xsd:dateTime`<a id="dateTimeEQdateTime"></a>:
This is **not part of the [SEP-0002](https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0002/sep-0002.md)**, but still supported.  
This operation does not handle different timezones correctly yet. For example `2025-12-24T18:15:00Z` (UTC) and `2025-12-24T17:15:00-01:00` (UTC - 1) will not be seen as equal.
??? note "Example query for `xsd:dateTime = xsd:dateTime`"

    The first two dates and times are equal. The third date has another time.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date1 ?date2 ?date3 ?eq ?neq
    WHERE {
        BIND("2025-12-24T18:15:00Z"^^xsd:dateTime AS ?date1)
	    BIND("2025-12-24T18:15:00Z"^^xsd:dateTime AS ?date2)
	    BIND("2025-12-24T18:20:30Z"^^xsd:dateTime AS ?date3)
		BIND(?date1 = ?date2 AS ?eq)
		BIND(?date1 = ?date3 AS ?neq)
    }
    ```

### Less Than  <

`xsd:yearMonthDuration < xsd:yearMonthDuration`<a id="yearMonthDurationLTyearMonthDuration"></a>: TODO: this only works with same digits -> P2Y2M < P14Y2M does not work correctly
??? note "Example query for `xsd:yearMonthDuration < xsd:yearMonthDuration`"

    The first duration is smaller than the second.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?duration1 ?duration2 ?lt1 ?lt2
    WHERE {
        BIND("P12Y2M"^^xsd:yearMonthDuration AS ?duration1)
        BIND("P14Y2M"^^xsd:yearMonthDuration AS ?duration2)

        BIND(?duration1 < ?duration2 AS ?lt1)
        BIND(?duration2 < ?duration1 AS ?lt2)
    }
    ```

`xsd:dayTimeDuration < xsd:dayTimeDuration`<a id="dayTimeDurationLTdayTimeDuration"></a>:
??? note "Example query for `xsd:dayTimeDuration < xsd:dayTimeDuration`"

    The first duration is smaller than the second.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?duration1 ?duration2 ?lt1 ?lt2
    WHERE {
        BIND("P2DT4H5M6S"^^xsd:dayTimeDuration AS ?duration1)
        BIND("P4DT4H5M6S"^^xsd:dayTimeDuration AS ?duration2)

        BIND(?duration1 < ?duration2 AS ?lt1)
        BIND(?duration2 < ?duration1 AS ?lt2)
    }
    ```

`xsd:date < xsd:date`<a id="dateLTdate"></a>:
??? note "Example query for `xsd:date < xsd:date`"

    The first date is earlier than the second date.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date1 ?date2 ?lt1 ?lt2
    WHERE {
        BIND("2019-12-31"^^xsd:date AS ?date1)
        BIND("2020-03-13"^^xsd:date AS ?date2)

        BIND(?date1 < ?date2 AS ?lt1)
        BIND(?date2 < ?date1 AS ?lt2)
    }
    ```

`xsd:time < xsd:time`<a id="timeLTtime"></a>:
This operation does not handle different timezones correctly yet. For example `09:30:10Z` (UTC) will not be seen as earlier than `08:30:10-02:00` (UTC - 2).
??? note "Example query for `xsd:time < xsd:time`"

    The first time is two hours and one minute earlier than the second time.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?time1 ?time2 ?lt1 ?lt2
    WHERE {
        BIND("09:30:10Z"^^xsd:time AS ?time1)
        BIND("11:31:10Z"^^xsd:time AS ?time2)

        BIND(?time1 < ?time2 AS ?lt1)
        BIND(?time2 < ?time1 AS ?lt2)
    }
    ```

`xsd:dateTime < xsd:dateTime`<a id="dateTimeLTdateTime"></a>:
This is **not part of the [SEP-0002](https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0002/sep-0002.md)**, but still supported.  
This operation does not handle different timezones correctly yet. For example `2025-12-24T14:15:00Z` (UTC) will not be seen as earlier than `2025-12-24T13:15:00-02:00` (UTC - 2).
??? note "Example query for `xsd:dateTime < xsd:dateTime`"

    The dates are equal, but the first time is earlier than the second.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date1 ?date2 ?lt1 ?lt2
    WHERE {
        BIND("2025-12-24T14:15:00Z"^^xsd:dateTime AS ?date1)
	    BIND("2025-12-24T18:15:00Z"^^xsd:dateTime AS ?date2)
		BIND(?date1 < ?date2 AS ?lt1)
		BIND(?date2 < ?date1 AS ?lt2)
    }
    ```

### Greater Than  >

`xsd:yearMonthDuration > xsd:yearMonthDuration`<a id="yearMonthDurationGTyearMonthDuration"></a>: TODO: this only works with same digits -> P12Y2M > P9Y2M does not work correctly
??? note "Example query for `xsd:yearMonthDuration > xsd:yearMonthDuration`"

    The first duration is larger than the second.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?duration1 ?duration2 ?gt1 ?gt2
    WHERE {
        BIND("P12Y2M"^^xsd:yearMonthDuration AS ?duration1)
        BIND("P10Y2M"^^xsd:yearMonthDuration AS ?duration2)

        BIND(?duration1 > ?duration2 AS ?gt1)
        BIND(?duration2 > ?duration1 AS ?gt2)
    }
    ```

`xsd:dayTimeDuration > xsd:dayTimeDuration`<a id="dayTimeDurationGTdayTimeDuration"></a>:
??? note "Example query for  `xsd:dayTimeDuration > xsd:dayTimeDuration`"

    The first duration is larger than the second.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?duration1 ?duration2 ?gt1 ?gt2
    WHERE {
        BIND("P4DT4H5M6S"^^xsd:dayTimeDuration AS ?duration1)
        BIND("P2DT4H5M6S"^^xsd:dayTimeDuration AS ?duration2)

        BIND(?duration1 > ?duration2 AS ?gt1)
        BIND(?duration2 > ?duration1 AS ?gt2)
    }
    ```

`xsd:date > xsd:date`<a id="dateGTdate"></a>:
??? note "Example query for  `xsd:date > xsd:date`"

    The first date is later than the second date.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date1 ?date2 ?gt1 ?gt2
    WHERE {
        BIND("2020-03-13"^^xsd:date AS ?date1)
        BIND("2019-12-31"^^xsd:date AS ?date2)

        BIND(?date1 > ?date2 AS ?gt1)
        BIND(?date2 > ?date1 AS ?gt2)
    }
    ```

`xsd:time > xsd:time`<a id="timeGTtime"></a>:
This operation does not handle different timezones correctly yet. For example `10:30:10Z` (UTC) will not be seen as later than `12:30:10+04:00` (UTC + 4).
??? note "Example query for `xsd:time > xsd:time`"

    The first time is four hours, one minute, and two seconds later than the second time.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?time1 ?time2 ?gt1 ?gt2
    WHERE {
        BIND("14:31:12Z"^^xsd:time AS ?time1)
        BIND("10:30:10Z"^^xsd:time AS ?time2)

        BIND(?time1 > ?time2 AS ?gt1)
        BIND(?time2 > ?time1 AS ?gt2)
    }
    ```

`xsd:dateTime > xsd:dateTime`<a id="dateTimeGTdateTime"></a>:
This is **not part of the [SEP-0002](https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0002/sep-0002.md)**, but still supported.  
This operation does not handle different timezones correctly yet. For example `2025-12-24T10:30:10Z` (UTC) will not be seen as later than `2025-12-24T12:30:10+04:00` (UTC + 4).
??? note "Example query for `xsd:dateTime > xsd:dateTime`"

    The dates are equal, but the first time is later than the second.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date1 ?date2 ?gt1 ?gt2
    WHERE {
        BIND("2025-12-24T18:15:00Z"^^xsd:dateTime AS ?date1)
	    BIND("2025-12-24T14:15:00Z"^^xsd:dateTime AS ?date2)
		BIND(?date1 > ?date2 AS ?gt1)
		BIND(?date2 > ?date1 AS ?gt2)
    }
    ```

### Subtraction

`xsd:date - xsd:date`<a id="date-date"></a>:
Returns the `xsd:dayTimeDuration` between the two dates. The arguments need to be valid dates (e.g. `"2025-02-30"^^xsd:date` is not allowed).

??? note "Example query for `xsd:date - xsd:date`"

    There are 73 days between the two dates.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date1 ?date2
        ((?date1 - ?date2) AS ?differenceInDays)
    WHERE {
        BIND("2020-03-13"^^xsd:date AS ?date1)
        BIND("2019-12-31"^^xsd:date AS ?date2)
    }
    ```

`xsd:date - xsd:dayTimeDuration`<a id="date-dayTimeDuration"></a>:
Returns the `xsd:dateTime` that is the amount of days and the time of the duration earlier than the given date. The first argument needs to be a valid date. If the duration only specifies days the time of the result date is set to `00:00:00`.

??? note "Example query for `xsd:date - dayTimeDuration`"

    The date 2025-05-05 at 23:10:30 is 10 days, 49 minutes and 30 seconds earlier than the start date.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date ?duration ((?date - ?duration) AS ?difference)  WHERE {
        BIND("2025-05-16"^^xsd:date AS ?date)
        BIND("P10DT0H49M30S"^^xsd:dayTimeDuration AS ?duration)
    }
    ```

`xsd:date - xsd:yearMonthDuration`<a id="date-yearMonthDuration"></a>: TODO: supported?

`xsd:time - xsd:time`<a id="time-time"></a>: TODO: supported?
`xsd:time - xsd:dayTimeDuration`<a id="time-dayTimeDuration"></a>: TODO: supported?

`xsd:dateTime - xsd:dateTime`<a id="dateTime-dateTime"></a>:
Returns the `xsd:dayTimeDuration` between the two date and their times. The arguments need to be valid dates.

??? note "Example query for `xsd:dateTime - xsd:dateTime`"

    There are 23 days, 6 hours, 14 minutes, and 30 seconds between the two dates and their times.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date1 ?date2
        ((?date1 - ?date2) AS ?difference) WHERE {
        BIND("2025-12-24T18:15:00Z"^^xsd:dateTime AS ?date1)
        BIND("2025-12-01T12:00:30Z"^^xsd:dateTime AS ?date2)
    }   
    ```

`xsd:dateTime - xsd:dayTimeDuration`<a id="dateTime-dayTimeDuration"></a>:
Returns the `xsd:dateTime` that is the amount of days and the time of the duration earlier than the given date and time. The first argument needs to be a valid date.

??? note "Example query for `xsd:dateTime - dayTimeDuration`"

    The date 2000-01-01 is 2 days, 12 hours, 12 minutes and 12 seconds earlier than the start date and time.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?dateTime ?duration ((?dateTime - ?duration) AS ?difference) WHERE {
        BIND("2000-01-03T12:12:12Z"^^xsd:dateTime AS ?dateTime)
        BIND("P2DT12H12M12S"^^xsd:dayTimeDuration AS ?duration)
    }

    ```

`xsd:dateTime - xsd:yearMonthDuration`<a id="dateTime-yearMonthDuration"></a>: TODO: supported?


### Addition

`xsd:date + xsd:dayTimeDuration`<a id="date+dayTimeDuration"></a>:
Returns the `xsd:dateTime` that is the amount of days and the time of the duration later than the given date and time. The first argument needs to be a valid date.

??? note "Example query for `xsd:date + dayTimeDuration`"

    The date 2025-05-26 at 00:49:30 is 10 days, 49 minutes and 30 seconds later than the start date.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?date ?duration ((?date + ?duration) AS ?difference)  WHERE {
        BIND("2025-05-16"^^xsd:date AS ?date)
        BIND("P10DT0H49M30S"^^xsd:dayTimeDuration AS ?duration)
    }
    ```

`xsd:date + xsd:yearMonthDuration`<a id="date+yearMonthDuration"></a>: TODO: supported?

`xsd:time + xsd:dayTimeDuration`<a id="time+dayTimeDuration"></a>: TODO: supported?

`xsd:dateTime + xsd:dayTimeDuration`<a id="dateTime+dayTimeDuration"></a>:
Returns the `xsd:dateTime` that is the amount of days and the time of the duration later than the given date and time. The first argument needs to be a valid date.

??? note "Example query for `xsd:dateTime + dayTimeDuration`"

    The date 2000-01-01 is 7 days, 3 hours, 44 minutes and 30 seconds later than the start date and time.

    ```sparql {data-demo-engine="osm-planet"}
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?dateTime ?duration ((?dateTime + ?duration) AS ?difference) WHERE {
        BIND("1999-12-24T20:15:30Z"^^xsd:dateTime AS ?dateTime)
        BIND("P7DT3H44M30S"^^xsd:dayTimeDuration AS ?duration)
    }
    ```

`xsd:dateTime + xsd:yearMonthDuration`<a id="date+dayTimeDuration"></a>:  TODO: supported?
