import { ComponentStory } from "@storybook/react";
import ClippingView from "../components/ClippingView/ClippingView";

export default {
  component: ClippingView,
};

const Template: ComponentStory<typeof ClippingView> = () => <ClippingView />;

export const DefaultView = Template.bind({});
