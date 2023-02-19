-- BEFORE DEPLOY
-- prepare mapPositions objects in GameStarted events
update
	"Events"
set
	"SerializedPayload" = jsonb_set("SerializedPayload"::jsonb, '{options,mapPositions}', (
		select jsonb_agg(new_list.new_val)
		from (
			select json_build_object('name', value, 'color', null) as new_val
			from jsonb_array_elements("SerializedPayload"::jsonb->'options'->'mapPositionNames')
		) as new_list
	))
where
	"EventType" = 'GameStarted'
	and "SerializedPayload"::jsonb->'options'->'mapPositionNames' is not null;

-- AFTER DEPLOY
-- remove mapPositionNames (as it is no longer used by the system)
update
    "Events"
set
    "SerializedPayload" = "SerializedPayload"::jsonb #- '{options,mapPositionNames}'
where
    "EventType" = 'GameStarted'
    and "SerializedPayload"::jsonb->'options'->'mapPositionNames' is not null;
