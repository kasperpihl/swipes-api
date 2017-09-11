const generateWayFour = (user_id) => {
  return {
    goal: {
      assignees: [],
      attachment_order: [
        'a',
        'b',
        'c',
      ],
      attachments: {
        a: {
          link: {
            service: {
              type: 'note',
            },
          },
          text: {
            blocks: [
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: '1dojn',
                text: 'Tone of voice',
                type: 'header-two',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [
                  {
                    length: 34,
                    offset: 0,
                    style: 'ITALIC',
                  },
                ],
                key: '9u17s',
                text: 'Fun, friendly, youthful, inspiring',
                type: 'unstyled',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: 'v28v',
                text: '',
                type: 'unstyled',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: '479jn',
                text: 'Target group',
                type: 'header-two',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [
                  {
                    length: 23,
                    offset: 0,
                    style: 'ITALIC',
                  },
                ],
                key: '4l5hr',
                text: 'People aged 13 and over',
                type: 'unstyled',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: 'bbfnu',
                text: '',
                type: 'unstyled',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: '355ef',
                text: 'Sections to update',
                type: 'header-two',
              },
              {
                data: {
                  checked: true,
                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: '1urn5',
                text: 'Home Page',
                type: 'checklist',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: '8f04v',
                text: '4 sections',
                type: 'unstyled',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: '53s71',
                text: 'http://www.mms.com/',
                type: 'unstyled',
              },
              {
                data: {
                  checked: true,
                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: '316q5',
                text: 'Products List',
                type: 'checklist',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: 'a6a27',
                text: 'http://www.mms.com/#product',
                type: 'unstyled',
              },
              {
                data: {
                  checked: true,
                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: '9e0qq',
                text: 'Products Detail Pages',
                type: 'checklist',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: 'bprgn',
                text: 'http://www.mms.com/us/product/peanut',
                type: 'unstyled',
              },
              {
                data: {
                  checked: false,
                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [
                  {
                    length: 11,
                    offset: 11,
                    style: 'ITALIC',
                  },
                ],
                key: 'c1fd4',
                text: 'Online Shop (canceled)',
                type: 'checklist',
              },
              {
                data: {

                },
                depth: 0,
                entityRanges: [

                ],
                inlineStyleRanges: [

                ],
                key: '6bqtt',
                text: '',
                type: 'unstyled',
              },
            ],
            entityMap: {

            },
          },
          title: 'Specifications',
        },
        b: {
          link: {
            service: {
              id: 'https://www.pinterest.com/pin/55591376633842669/',
              name: 'swipes',
              type: 'url',
            },
          },
          title: 'Our best selling product',
        },
        c: {
          link: {
            service: {
              id: 'http://www.mms.com',
              name: 'swipes',
              type: 'url',
            },
          },
          title: 'Moodboard',
        },
      },
      step_order: [
        'a',
        'b',
        'c',
        'd',
        'e',
      ],
      steps: {
        a: {
          assignees: [
            'USOFI',
          ],
          title: 'Requirements',
          completed_at: new Date(),
        },
        b: {
          assignees: [
            user_id,
          ],
          title: 'Content Draft',
          completed_at: new Date(),
        },
        c: {
          assignees: [
            'USOFI',
            user_id,
          ],
          title: 'Test with the team',
          completed_at: new Date(),
        },
        d: {
          assignees: [
            user_id,
          ],
          title: 'Final details',
          completed_at: new Date(),
        },
        e: {
          assignees: [
            'USOFI',
          ],
          title: 'Submit',
          completed_at: new Date(),
        },
      },
      title: 'Website copy',
    },
  };
};

export {
  generateWayFour,
};
