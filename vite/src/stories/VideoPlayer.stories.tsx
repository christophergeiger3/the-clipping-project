import { ComponentStory } from "@storybook/react";
import VideoPlayer from "../components/VideoPlayer";

export default {
  title: "VideoPlayer",
  component: VideoPlayer,
};

const Template: ComponentStory<typeof VideoPlayer> = (args) => (
  <VideoPlayer {...args} />
);

export const BigBuckBunny = Template.bind({});
BigBuckBunny.args = {
  src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
};
