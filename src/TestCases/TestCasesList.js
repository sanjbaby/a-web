import React from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Tooltip,
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { DragHandle, Edit as EditIcon, Warning as WarningIcon } from "@material-ui/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { openTestCaseForm, saveTestCase, saveTestCaseOrder } from "../actions/testCasesActions";

const reorder = (list, startIndex, endIndex) => {
  let result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,

  ...(isDragging && {
    background: "rgb(235,235,235)",
  }),
});

const getListStyle = (isDraggingOver) => ({
  //background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

const TestCasesList = (props) => {
  const dispatch = useDispatch();
  const testCases = useSelector((state) => state.testCases);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(testCases.items, result.source.index, result.destination.index);

    dispatch(saveTestCaseOrder(items));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <RootRef rootRef={provided.innerRef}>
            <List style={getListStyle(snapshot.isDraggingOver)}>
              {testCases.items.map((item, index) => (
                <Draggable
                  key={item._id}
                  draggableId={item._id}
                  index={index}
                  isDragDisabled={testCases.isSaving || testCases.isFetching}
                >
                  {(provided, snapshot) => (
                    <ListItem
                      ContainerComponent="li"
                      ContainerProps={{ ref: provided.innerRef }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      <ListItemIcon>
                        <DragHandle />
                      </ListItemIcon>
                      <ListItemText primary={index + 1 + ". " + item.desc} secondary={item.name} />
                      {!snapshot.isDragging && (
                        <ListItemSecondaryAction>
                          {item.template_deleted ? (
                            <Tooltip title="Template not found for this test case, might be it is deleted">
                              <span>
                                <IconButton disabled>
                                  <WarningIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title={item.enabled ? "Disable test case" : "Enable test case"}
                            >
                              <Switch
                                edge="end"
                                name={item._id}
                                checked={item.enabled}
                                disabled={
                                  testCases.isSaving ||
                                  testCases.isFetching ||
                                  item.template_deleted
                                }
                                onChange={() =>
                                  dispatch(
                                    saveTestCase(
                                      _.omit(
                                        {
                                          ...item,
                                          enabled: !item.enabled,
                                        },
                                        Object.keys(item).filter((key) => key.startsWith("_"))
                                      ),
                                      item._id,
                                      item._etag
                                    )
                                  )
                                }
                                color="primary"
                              />
                            </Tooltip>
                          )}
                          <Tooltip title="Edit test case">
                            <IconButton onClick={() => dispatch(openTestCaseForm(item))}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          </RootRef>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TestCasesList;
